export interface CreateFormRequest {
  name: string;
  description?: string;
  user_id: number;
  schema?: Record<string, unknown>;
  settings?: Record<string, unknown>;
}

export interface UpdateFormRequest {
  name?: string;
  description?: string;
  schema?: Record<string, unknown>;
  settings?: Record<string, unknown>;
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
  google_sheet_id: string | null;
  google_sheet_name: string | null;
  google_sheet_linked_at: string | null;
  google_sheet_auto_sync: boolean;
  created_at: string;
  updated_at: string;
}

export interface FormSubmission {
  id: number;
  form_id: number;
  data: Record<string, string | string[] | boolean>;
  meta: Record<string, unknown>;
  created_at: string;
}

export interface FormResponsesResult {
  responses: FormSubmission[];
  count: number;
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

export interface LinkGoogleSheetRequest {
  spreadsheet_id: string;
}

export interface CreateGoogleSheetRequest {
  title?: string;
}

export interface CreateGoogleSheetResponse {
  form: FormResponse;
  spreadsheet_id: string;
  spreadsheet_url: string;
}
