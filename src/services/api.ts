import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

interface CreateFormRequest {
    name: string;
    description?: string;
    user_id: number;
    schema: Record<string, unknown>;
}

interface FormResponse {
    id: number;
    name: string;
    description: string;
    user_id: number;
    created_at: string;
    updated_at: string;
}

export const createForm = async (data: CreateFormRequest): Promise<FormResponse> => {
    try {
        console.log("Creating form with data:", JSON.stringify(data, null, 2));
        const response = await api.post<FormResponse>("/forms", data);
        return response.data;
    } catch (error) {
        console.error("Error creating form:", error);
        throw error;
    }
}

export default api;