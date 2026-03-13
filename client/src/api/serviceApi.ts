import api from './axios';
import type { Category } from './categoryApi';

export interface ServiceData {
    serviceTitle: string;
    category: Category;
    language: string;
    description: string;
    location: {
        type: 'Point';
        coordinates: [number, number]; // [longitude, latitude]
    };
    radius: number; // in meters
    contactDetails: {
        phone: string;
        whatsapp?: string;
    };
    phoneNumber: string; // Including top-level phoneNumber as required by schema
}

export type CreateServiceDto = Omit<ServiceData, 'category'> & {
    category: string;
};


export interface Service extends ServiceData {
    _id: string;
    distance?: number;
    createdAt: string;
    updatedAt: string;
}

export const createService = async (data: CreateServiceDto) => {
    const response = await api.post('/services', data);
    return response.data;
};

export interface SearchParams {
    query?: string; // category or text
    lat?: number;
    lng?: number;
    radius?: number; // in meters
    page?: number;
    limit?: number;
}

export interface ServiceResponse {
    success: boolean;
    data: Service[];
    pagination?: {
        total: number;
        page: number;
        limit: number;
        hasMore: boolean;
    };
}

export const searchServices = async (params: SearchParams): Promise<ServiceResponse> => {
    const response = await api.get('/search', { params });
    return response.data;
};

export interface AiSearchResponse {
    success: boolean;
    interpretedQuery: any;
    results: Service[];
}

export const aiSearchServices = async (formData: FormData): Promise<AiSearchResponse> => {
    const response = await api.post('/ai/search', formData);
    return response.data;
};
