import api from './axios';

export interface ServiceData {
    serviceTitle: string;
    category: string;
    language: string;
    description: string;
    location: {
        type: 'Point';
        coordinates: [number, number]; // [longitude, latitude]
    };
    radius: number; // in meters
    contactDetails: {
        phone: string;
        whatsapp: string;
    };
    phoneNumber: string; // Including top-level phoneNumber as required by schema
}

export interface Service extends ServiceData {
    _id: string;
    distance?: number; 
    createdAt: string;
    updatedAt: string;
}

export const createService = async (data: ServiceData) => {
    const response = await api.post('/services', data);
    return response.data;
};

export interface SearchParams {
    query?: string; // category or text
    lat?: number;
    lng?: number;
    radius?: number; // in meters
}

export const searchServices = async (params: SearchParams) => {
    const response = await api.get('/search', { params });
    return response.data;
};
