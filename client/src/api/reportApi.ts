import api from './axios';

export interface ReportFormData {
    serviceId: string;
    reason: string;
    comment?: string;
    reportedAt: string;
}

export interface ReportResponse {
    success: boolean;
    message: string;
}

export const submitReport = async (data: ReportFormData): Promise<ReportResponse> => {
    const response = await api.post('/reports', data);
    return response.data;
};
