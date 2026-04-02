import { Briefcase, Bug, Car, Cog, Grid, Hammer, Home, Key, MoreHorizontal, Paintbrush, Ruler, Search, Sparkles, Trees, Truck, Wind, Wrench, Zap, Mic, Paperclip, X, Square, Video } from 'lucide-react';

import { useEffect, useState, useRef, type FC } from 'react';
import { fetchCategories } from '../../api/categoryApi';

interface SearchHeroProps {
    onSearch: (query: string) => void;
    onAiSearch?: (query: string, audio: Blob | null, image: File | null, video: File | null) => void;
}

interface DisplayCategory {
    id: string;
    label: string;
    icon: React.ReactNode;
}

const DEFAULT_CATEGORY: DisplayCategory = { id: 'all', label: 'All', icon: <Grid className="w-4 h-4" /> };

const getCategoryIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('plumb')) return <Wrench className="w-4 h-4" />;
    if (lower.includes('electr')) return <Zap className="w-4 h-4" />;
    if (lower.includes('clean')) return <Sparkles className="w-4 h-4" />;
    if (lower.includes('landscap')) return <Trees className="w-4 h-4" />;
    if (lower.includes('handy')) return <Hammer className="w-4 h-4" />;
    if (lower.includes('mov')) return <Truck className="w-4 h-4" />;
    if (lower.includes('paint')) return <Paintbrush className="w-4 h-4" />;
    if (lower.includes('hvac')) return <Wind className="w-4 h-4" />;
    if (lower.includes('roof')) return <Home className="w-4 h-4" />;
    if (lower.includes('pest')) return <Bug className="w-4 h-4" />;
    if (lower.includes('applianc')) return <Cog className="w-4 h-4" />;
    if (lower.includes('lock')) return <Key className="w-4 h-4" />;
    if (lower.includes('carpent')) return <Ruler className="w-4 h-4" />;
    if (lower.includes('other')) return <MoreHorizontal className="w-4 h-4" />;
    if (lower.includes('mechanic')) return <Car className="w-4 h-4" />;
    return <Briefcase className="w-4 h-4" />;
};

export const SearchHero: FC<SearchHeroProps> = ({ onSearch, onAiSearch }) => {
    const [searchText, setSearchText] = useState('');
    const [aiSearchText, setAiSearchText] = useState('');

    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);

    const [isRecordingVideo, setIsRecordingVideo] = useState(false);
    const videoPreviewRef = useRef<HTMLVideoElement>(null);
    const videoStreamRef = useRef<MediaStream | null>(null);
    const videoRecorderRef = useRef<MediaRecorder | null>(null);
    const videoChunksRef = useRef<Blob[]>([]);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [categories, setCategories] = useState<DisplayCategory[]>([DEFAULT_CATEGORY]);



    // Fetch categories
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategories();
                const formatted: DisplayCategory[] = data.map(cat => ({
                    id: cat._id, // Use _id as the search key
                    label: cat.name,
                    icon: getCategoryIcon(cat.name)
                }));
                setCategories([DEFAULT_CATEGORY, ...formatted]);
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };
        loadCategories();
    }, []);

    const handleSearchSubmit = () => {
        onSearch(searchText === 'all' ? '' : searchText);
    };

    const handleAiSearchSubmit = () => {
        if (onAiSearch && (aiSearchText.trim() || audioBlob || imageFile || videoFile)) {
            onAiSearch(aiSearchText.trim(), audioBlob, imageFile, videoFile);
            setAiSearchText('');
            setAudioBlob(null);
            setImageFile(null);
            setVideoFile(null);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) audioChunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setAudioBlob(audioBlob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error("Error accessing microphone:", error);
            alert("Could not access the microphone.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const startVideoRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            videoStreamRef.current = stream;
            
            setIsRecordingVideo(true);
            
            setTimeout(() => {
                if (videoPreviewRef.current) {
                    videoPreviewRef.current.srcObject = stream;
                }
            }, 100);

            const options = MediaRecorder.isTypeSupported('video/webm; codecs=vp9') ? { mimeType: 'video/webm; codecs=vp9' } : 
                            MediaRecorder.isTypeSupported('video/webm') ? { mimeType: 'video/webm' } : 
                            MediaRecorder.isTypeSupported('video/mp4') ? { mimeType: 'video/mp4' } : undefined;

            const mediaRecorder = new MediaRecorder(stream, options);
            videoRecorderRef.current = mediaRecorder;
            videoChunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) videoChunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const mimeType = videoRecorderRef.current?.mimeType || 'video/webm';
                const blob = new Blob(videoChunksRef.current, { type: mimeType });
                const file = new File([blob], 'video_recording.webm', { type: mimeType });
                setVideoFile(file);
                
                if (videoStreamRef.current) {
                    videoStreamRef.current.getTracks().forEach(track => track.stop());
                }
                setIsRecordingVideo(false);
            };

            mediaRecorder.start();

            // Auto stop after 10 seconds
            setTimeout(() => {
                if (videoRecorderRef.current && videoRecorderRef.current.state === 'recording') {
                    videoRecorderRef.current.stop();
                }
            }, 10000);

        } catch (error) {
            console.error("Error accessing camera:", error);
            alert("Could not access the camera. Please check permissions.");
            setIsRecordingVideo(false);
        }
    };

    const stopVideoRecording = () => {
        if (videoRecorderRef.current && videoRecorderRef.current.state === 'recording') {
            videoRecorderRef.current.stop();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type.startsWith('video/')) {
                setVideoFile(file);
                setImageFile(null); // Clear image if video is selected
            } else if (file.type.startsWith('image/')) {
                setImageFile(file);
                setVideoFile(null); // Clear video if image is selected
            }
        }
    };

    const clearAudio = () => setAudioBlob(null);
    const clearImage = () => {
        setImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };
    const clearVideo = () => {
        setVideoFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleCategoryClick = (catId: string, label: string) => {
        setSelectedCategory(catId);
        // If "All" is selected, clear search. Otherwise use the ID or Name.
        // The backend search might expect a name or ID. 
        // Based on previous tasks, the search on backend checks `category.name` or `serviceTitle`.
        // So we should probably pass the category name (label) as the query if it's not 'all'.
        onSearch(catId === 'all' ? '' : label);
    };

    return (
        <div className="bg-white pb-8 pt-12 px-4 border-b border-gray-100">
            <div className="max-w-5xl mx-auto text-center space-y-8">
                <div className="animate-start animate-fadeInUp">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        Find Local Services
                    </h1>
                    <p className="mt-3 text-lg text-gray-500">
                        Connect with trusted professionals near you
                    </p>
                </div>

                {/* Search Inputs Container */}
                <div className="flex flex-col gap-4 max-w-2xl mx-auto p-2 animate-start animate-fadeInUp anim-delay-2">
                    {/* Natural Language AI Search */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Sparkles className="h-5 w-5 text-amber-500" />
                        </div>
                        <input
                            type="text"
                            value={aiSearchText}
                            onChange={(e) => setAiSearchText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAiSearchSubmit()}
                            className="block w-full pl-11 pr-[210px] py-4 bg-white border-2 border-amber-200 rounded-2xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all shadow-md text-gray-900 placeholder-gray-400 font-medium text-xs sm:text-base"
                            placeholder="Describe the help you need... e.g. My sink is leaking"
                        />
                        
                        <div className="absolute right-2 top-2 bottom-2 flex items-center gap-1">
                            {/* Hidden File Input */}
                            <input 
                                type="file" 
                                accept="image/*,video/*" 
                                className="hidden" 
                                ref={fileInputRef} 
                                onChange={handleFileChange}
                            />
                            
                            {/* Paperclip Button */}
                            {(!imageFile && !videoFile) ? (
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                                    title="Attach an image/video"
                                >
                                    <Paperclip className="w-5 h-5" />
                                </button>
                            ) : imageFile ? (
                                <div className="flex items-center bg-amber-100 rounded-lg px-2 py-1 gap-1 border border-amber-200">
                                    <span className="text-xs text-amber-800 truncate w-12">{imageFile.name}</span>
                                    <button onClick={clearImage} className="text-amber-600 hover:text-amber-800">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : null}

                            {/* Video Recording Button */}
                            {(!imageFile && !videoFile && !audioBlob) && (
                                <button
                                    onClick={isRecordingVideo ? stopVideoRecording : startVideoRecording}
                                    className={`p-2 rounded-lg transition-colors ${
                                        isRecordingVideo ? 'text-red-500 bg-red-50 animate-pulse' : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50'
                                    }`}
                                    title={isRecordingVideo ? "Stop video recording" : "Record video (10s max)"}
                                    disabled={isRecording}
                                >
                                    {isRecordingVideo ? <Square className="w-5 h-5 fill-current" /> : <Video className="w-5 h-5" />}
                                </button>
                            )}

                            {/* Video Badge UI */}
                            {videoFile && (
                                <div className="flex items-center bg-amber-100 rounded-lg px-2 py-1 gap-1 border border-amber-200">
                                    <Video className="w-3 h-3 text-amber-800" />
                                    <span className="text-xs text-amber-800 truncate w-12">{videoFile.name}</span>
                                    <button onClick={clearVideo} className="text-amber-600 hover:text-amber-800">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            {/* Mic Button */}
                            {!audioBlob ? (
                                <button
                                    onClick={isRecording ? stopRecording : startRecording}
                                    className={`p-2 rounded-lg transition-colors ${
                                        isRecording ? 'text-red-500 bg-red-50 animate-pulse' : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50'
                                    }`}
                                    title={isRecording ? "Stop recording" : "Record voice"}
                                >
                                    {isRecording ? <Square className="w-5 h-5 fill-current" /> : <Mic className="w-5 h-5" />}
                                </button>
                            ) : (
                                <div className="flex items-center bg-amber-100 rounded-lg px-2 py-1 gap-1 border border-amber-200">
                                    <span className="text-xs text-amber-800">Audio</span>
                                    <button onClick={clearAudio} className="text-amber-600 hover:text-amber-800">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            <button
                                onClick={handleAiSearchSubmit}
                                className="px-4 py-2 h-full bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold transition-colors shadow-sm text-sm ml-1"
                            >
                                Search
                            </button>
                        </div>

                        {/* Video Preview */}
                        {isRecordingVideo && (
                            <div className="absolute top-[110%] right-0 z-50 w-64 bg-black rounded-xl overflow-hidden shadow-2xl border-2 border-red-500">
                               <video ref={videoPreviewRef} autoPlay muted playsInline className="w-full aspect-video object-cover" />
                               <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                                   REC 10s
                               </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4 py-2">
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">OR STANDARD SEARCH</span>
                        <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    {/* Standard Search */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                            className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-shadow text-sm"
                            placeholder="Search by keywords..."
                        />
                    </div>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap justify-center gap-3 animate-start animate-fadeIn anim-delay-4">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat.id, cat.label)}
                            className={`
                                flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all border
                                ${selectedCategory === cat.id
                                    ? 'bg-black text-white border-black shadow-md'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
                            `}
                        >
                            <span className="mr-2 flex items-center">{cat.icon}</span>
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
