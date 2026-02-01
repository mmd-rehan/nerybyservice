import axios from 'axios';

const API_URL = 'http://localhost:3030/api';

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

export const createService = async (data: ServiceData) => {
    const response = await axios.post(`${API_URL}/services`, data);
    return response.data;
};

export interface SearchParams {
    query?: string; // category or text
    lat?: number;
    lng?: number;
    radius?: number; // in meters
}

export const searchServices = async (params: SearchParams) => {
    const response = await axios.get(`${API_URL}/search`, { params });
    return response.data;
};
