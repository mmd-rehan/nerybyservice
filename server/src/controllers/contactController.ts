import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { z } from 'zod';

// Define Zod schema for validation
const contactSchema = z.object({
    name: z.string().min(2, 'Name is too short'),
    email: z.string().email('Invalid email address'),
    subject: z.string().min(5, 'Subject is too short'),
    message: z.string().min(10, 'Message is too short'),
});

export const sendContactEmail = async (req: Request, res: Response) => {
    try {
        // Validate request body
        const validatedData = contactSchema.parse(req.body);
        const { name, email, subject, message } = validatedData;

        // Create a transporter using SMTP
        // NOTE: User will fill in the .env values later
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.example.com',
            port: Number(process.env.SMTP_PORT) || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER || 'user',
                pass: process.env.SMTP_PASS || 'pass',
            },
        });

        // Email content
        const mailOptions = {
            from: `"${name}" <${email}>`, // sender address
            to: process.env.CONTACT_EMAIL || 'support@nerybyservice.com', // list of receivers
            subject: `New Contact Request: ${subject}`, // Subject line
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`, // plain text body
            html: `
        <h3>New Contact Request</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>
      `, // html body
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.issues });
        }
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send email' });
    }
};
