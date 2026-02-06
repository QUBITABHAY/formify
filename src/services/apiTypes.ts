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

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  user: UserResponse;
}
