import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface CreateFormRequest {
  name: string;
  description?: string;
  user_id: number;
  schema: Record<string, unknown>;
}

export interface UpdateFormRequest {
  name?: string;
  description?: string;
  schema?: Record<string, unknown>;
  user_id?: number;
}

export interface FormResponse {
  id: number;
  name: string;
  description: string;
  user_id: number;
  schema: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export const createForm = async (
  data: CreateFormRequest,
): Promise<FormResponse> => {
  try {
    const response = await api.post<FormResponse>("/forms", data);
    return response.data;
  } catch (error) {
    console.error("Error creating form:", error);
    throw error;
  }
};

export const getForm = async (id: number): Promise<FormResponse> => {
  try {
    const response = await api.get<FormResponse>(`/forms/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching form ${id}:`, error);
    throw error;
  }
};

export const updateForm = async (
  id: number,
  data: UpdateFormRequest,
): Promise<FormResponse> => {
  try {
    const response = await api.put<FormResponse>(`/forms/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating form ${id}:`, error);
    throw error;
  }
};

export default api;
