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
  LinkGoogleSheetRequest,
  CreateGoogleSheetRequest,
  CreateGoogleSheetResponse,
} from "./apiTypes";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const createForm = async (
  data: CreateFormRequest,
): Promise<FormResponse> => {
  const response = await api.post<FormResponse>("/forms", data);
  return response.data;
};

export const getForms = async (userId: number = 1): Promise<FormResponse[]> => {
  const response = await api.get<FormResponse[]>(`/users/${userId}/forms`);
  return response.data;
};

export const getForm = async (id: number): Promise<FormResponse> => {
  const response = await api.get<FormResponse>(`/forms/${id}`);
  return response.data;
};

export const getPublicForm = async (
  shareUrl: string,
): Promise<FormResponse> => {
  const response = await api.get<FormResponse>(`/forms/share/${shareUrl}`);
  return response.data;
};

export const updateForm = async (
  id: number,
  data: UpdateFormRequest,
): Promise<FormResponse> => {
  const response = await api.put<FormResponse>(`/forms/${id}`, data);
  return response.data;
};

export const deleteForm = async (id: number): Promise<void> => {
  await api.delete(`/forms/${id}`);
};

export const publishForm = async (id: number): Promise<FormResponse> => {
  const response = await api.post<FormResponse>(`/forms/${id}/publish`);
  return response.data;
};

export const unpublishForm = async (id: number): Promise<FormResponse> => {
  const response = await api.post<FormResponse>(`/forms/${id}/unpublish`);
  return response.data;
};

export const submitResponse = async (
  formId: number,
  answers: Record<string, string | string[]>,
  meta: Record<string, unknown> = {},
): Promise<void> => {
  await api.post(`/forms/${formId}/responses`, { data: answers, meta });
};

export const getFormResponses = async (
  formId: number,
): Promise<FormResponsesResult> => {
  const response = await api.get<FormResponsesResult>(
    `/forms/${formId}/responses`,
  );
  return response.data;
};

export const getResponse = async (id: number): Promise<FormSubmission> => {
  const response = await api.get<FormSubmission>(`/responses/${id}`);
  return response.data;
};

export const deleteResponse = async (id: number): Promise<void> => {
  await api.delete(`/responses/${id}`);
};

export const linkGoogleSheet = async (
  formId: number,
  data: LinkGoogleSheetRequest,
): Promise<FormResponse> => {
  const response = await api.post<FormResponse>(
    `/forms/${formId}/sheets/link`,
    data,
  );
  return response.data;
};

export const createAndLinkGoogleSheet = async (
  formId: number,
  data: CreateGoogleSheetRequest,
): Promise<CreateGoogleSheetResponse> => {
  const response = await api.post<CreateGoogleSheetResponse>(
    `/forms/${formId}/sheets/create`,
    data,
  );
  return response.data;
};

export const unlinkGoogleSheet = async (
  formId: number,
): Promise<FormResponse> => {
  const response = await api.delete<FormResponse>(
    `/forms/${formId}/sheets/link`,
  );
  return response.data;
};

export const signup = async (data: SignupRequest): Promise<UserResponse> => {
  const response = await api.post<UserResponse>("/users", data);
  return response.data;
};

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login", data);
  return response.data;
};

export const getGoogleAuthUrl = (): string => {
  return `${api.defaults.baseURL}/auth/google`;
};

export const getCurrentUser = async (): Promise<UserResponse> => {
  const response = await api.get<UserResponse>("/auth/me");
  return response.data;
};

export default api;
