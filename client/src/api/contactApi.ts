import api from './axios';

export interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export const sendContactForm = async (data: ContactFormData) => {
    const response = await api.post('/contact', data);
    return response.data;
};
