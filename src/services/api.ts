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
  status: "draft" | "published";
  schema: Record<string, unknown>;
  settings: Record<string, unknown>;
  share_url: string | null;
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

export interface FormSubmission {
  id: number;
  form_id: number;
  data: Record<string, string | string[] | boolean>;
  meta: Record<string, any>;
  created_at: string;
}

export interface FormResponsesResult {
  form_id: number;
  count: number;
  responses: FormSubmission[];
}

export const getResponse = async (id: number): Promise<FormSubmission> => {
  try {
    const response = await api.get<FormSubmission>(`/responses/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching response ${id}:`, error);
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

export default api;
