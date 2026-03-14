import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { randomUUID } from 'crypto';
import { analyzeImage } from './novaImageService';
import { transcribeAudio } from './novaVoiceService';

/**
 * Extracts a single frame from a video buffer.
 */
const extractFrame = (inputPath: string, outputPath: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .screenshots({
                timestamps: [1], // 1 second in, or middle if shorter
                filename: path.basename(outputPath),
                folder: path.dirname(outputPath),
                size: '1280x720' // Reasonable resolution for Nova
            })
            .on('end', () => resolve())
            .on('error', (err) => reject(err));
    });
};

/**
 * Extracts audio from a video buffer.
 */
const extractAudio = (inputPath: string, outputPath: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .noVideo()
            .audioCodec('libmp3lame')
            .save(outputPath)
            .on('end', () => resolve())
            .on('error', (err) => reject(err));
    });
};

/**
 * Processes a video buffer by extracting a frame and audio,
 * analyzing both using Amazon Nova Multimodal capabilities,
 * and combining the results.
 * 
 * @param videoBuffer Buffer of the video
 * @param mimeType Mime type of the video (e.g., 'video/mp4')
 * @returns Combined text description
 */
export const processVideo = async (videoBuffer: Buffer, mimeType: string): Promise<string> => {
    const tempDir = os.tmpdir();
    const sessionId = randomUUID();
    
    // Determine extension, fallback to mp4
    const ext = mimeType.split('/')[1] || 'mp4';
    
    const videoPath = path.join(tempDir, `vid_${sessionId}.${ext}`);
    const framePath = path.join(tempDir, `frame_${sessionId}.jpg`);
    const audioPath = path.join(tempDir, `audio_${sessionId}.mp3`);

    try {
        // 1. Write video buffer to disk (ffmpeg needs a file or stream)
        await fs.promises.writeFile(videoPath, videoBuffer);

        // 2. Extract frame and audio concurrently
        console.log(`Extracting frame and audio for video ${sessionId}...`);
        
        let frameExtracted = true;
        let audioExtracted = true;

        try {
            await extractFrame(videoPath, framePath);
        } catch (e) {
            console.error("Frame extraction failed:", e);
            frameExtracted = false;
        }

        try {
            await extractAudio(videoPath, audioPath);
        } catch (e) {
            console.error("Audio extraction failed:", e);
            audioExtracted = false;
        }

        if (!frameExtracted && !audioExtracted) {
            throw new Error("Failed to extract both frame and audio from video.");
        }

        // 3. Process with Nova
        let visualDescription = "";
        let audioTranscription = "";

        if (frameExtracted) {
            try {
                const frameBuffer = await fs.promises.readFile(framePath);
                visualDescription = await analyzeImage(frameBuffer, 'image/jpeg');
            } catch (e) {
                console.error("Nova Image analysis failed for video frame:", e);
            }
        }

        if (audioExtracted) {
            try {
                const audioBuffer = await fs.promises.readFile(audioPath);
                audioTranscription = await transcribeAudio(audioBuffer, 'audio/mp3');
            } catch (e) {
                console.error("Nova Voice transcription failed for video audio:", e);
            }
        }

        // 4. Combine results
        let combinedParts = [];
        if (visualDescription) {
            // Nova sometimes returns full sentences. We just inject it.
            combinedParts.push(`Visuals show: ${visualDescription}`);
        }
        if (audioTranscription) {
            combinedParts.push(`User says: "${audioTranscription}"`);
        }

        const finalResult = combinedParts.join(" | ");
        console.log(`Video Analysis Result: ${finalResult}`);
        return finalResult;

    } catch (error) {
        console.error("Video processing pipeline error:", error);
        throw error;
    } finally {
        // 5. Cleanup temp files
        const filesToClean = [videoPath, framePath, audioPath];
        for (const file of filesToClean) {
            try {
                if (fs.existsSync(file)) {
                    await fs.promises.unlink(file);
                }
            } catch (e) {
                console.error(`Failed to clean up temp file ${file}:`, e);
            }
        }
    }
};
