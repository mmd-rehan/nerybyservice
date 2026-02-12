import api from './axios';

export interface Category {
    _id: string;
    name: string;
    slug: string;
    createdAt?: string;
    updatedAt?: string;
}

export const fetchCategories = async (): Promise<Category[]> => {
    const response = await api.get(`categories`);
    return response.data;
};

export const createCategory = async (name: string): Promise<Category> => {
    const response = await api.post(`categories`, { name });
    return response.data;
};
