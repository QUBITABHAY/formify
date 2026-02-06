import axios from "axios";
import type {
  CreateFormRequest,
  FormResponse,
  UpdateFormRequest,
  FormSubmission,
  FormResponsesResult,
  SignupRequest,
  UserResponse,
  LoginRequest,
  LoginResponse,
} from "./apiTypes";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

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

export const getForms = async (userId: number = 1): Promise<FormResponse[]> => {
  try {
    const response = await api.get<FormResponse[]>(`/users/${userId}/forms`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching forms for user ${userId}:`, error);
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

export const deleteForm = async (id: number): Promise<void> => {
  try {
    await api.delete(`/forms/${id}`);
  } catch (error) {
    console.error(`Error deleting form ${id}:`, error);
    throw error;
  }
};

export const getResponse = async (id: number): Promise<FormSubmission> => {
  try {
    const response = await api.get<FormSubmission>(`/responses/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching response ${id}:`, error);
    throw error;
  }
};

export const deleteResponse = async (id: number): Promise<void> => {
  try {
    await api.delete(`/responses/${id}`);
  } catch (error) {
    console.error(`Error deleting response ${id}:`, error);
    throw error;
  }
};

export const getFormResponses = async (
  formId: number,
): Promise<FormResponsesResult> => {
  try {
    const response = await api.get<FormResponsesResult>(
      `/forms/${formId}/responses`,
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching responses for form ${formId}:`, error);
    throw error;
  }
};

export const publishForm = async (id: number): Promise<FormResponse> => {
  try {
    const response = await api.post<FormResponse>(`/forms/${id}/publish`);
    return response.data;
  } catch (error) {
    console.error(`Error publishing form ${id}:`, error);
    throw error;
  }
};

export const unpublishForm = async (id: number): Promise<FormResponse> => {
  try {
    const response = await api.post<FormResponse>(`/forms/${id}/unpublish`);
    return response.data;
  } catch (error) {
    console.error(`Error unpublishing form ${id}:`, error);
    throw error;
  }
};

export const submitResponse = async (
  formId: number,
  answers: Record<string, string | string[]>,
  meta: Record<string, any> = {},
): Promise<void> => {
  try {
    await api.post(`/responses/${formId}`, { data: answers, meta });
  } catch (error) {
    console.error(`Error submitting response for form ${formId}:`, error);
    throw error;
  }
};

export const signup = async (data: SignupRequest): Promise<UserResponse> => {
  try {
    const response = await api.post<UserResponse>("/users", data);
    return response.data;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>("/auth/login", data);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const getGoogleAuthUrl = (): string => {
  return `${api.defaults.baseURL}/auth/google`;
};

export default api;
