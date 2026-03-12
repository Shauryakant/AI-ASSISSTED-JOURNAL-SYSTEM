import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
    baseURL: API_URL,
});

export const createJournalEntry = async (data: { userId: string, ambience: string, text: string, emotion?: string, keywords?: string[], summary?: string }) => {
    const response = await api.post('/journal', data);
    return response.data;
};

export const getJournalEntries = async (userId: string) => {
    const response = await api.get(`/journal/${userId}`);
    return response.data;
};

export const analyzeEmotion = async (text: string) => {
    const response = await api.post('/journal/analyze', { text });
    return response.data;
};

export const getInsights = async (userId: string) => {
    const response = await api.get(`/journal/insights/${userId}`);
    return response.data;
};

export default api;
