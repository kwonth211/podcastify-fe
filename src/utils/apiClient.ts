/**
 * API 클라이언트 유틸리티
 * Supabase Auth를 사용한 인증 및 API 호출
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase 클라이언트 초기화
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase: SupabaseClient | null = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// API Base URL
// 로컬 개발 환경일 때는 항상 로컬 API 사용
// 프로덕션에서는 환경 변수 또는 기본 프로덕션 URL 사용
const API_BASE = import.meta.env.DEV
  ? (import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v2')
  : (import.meta.env.VITE_API_URL || 'https://api.dailynewspod.com/api/v2');

/**
 * 공통 API 응답 타입
 */
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    [key: string]: any;
  };
}

/**
 * 페이지네이션 응답 타입
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    total: number;
    limit: number;
    offset: number;
  };
}

/**
 * 인증 헤더 가져오기
 */
async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (supabase) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }
  }

  return headers;
}

/**
 * API 에러 처리
 */
class APIError extends Error {
  constructor(
    public code: string,
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * API 응답 처리
 */
async function handleResponse<T>(response: Response): Promise<APIResponse<T>> {
  const data = await response.json();

  if (!response.ok) {
    throw new APIError(
      data.error?.code || 'UNKNOWN_ERROR',
      data.error?.message || `API request failed: ${response.status}`,
      response.status
    );
  }

  if (!data.success) {
    throw new APIError(
      data.error?.code || 'API_ERROR',
      data.error?.message || 'API request failed'
    );
  }

  return data;
}

/**
 * GET 요청
 */
export async function apiGet<T>(
  endpoint: string,
  params?: Record<string, string | number | boolean>
): Promise<APIResponse<T>> {
  const headers = await getAuthHeaders();
  
  let url = `${API_BASE}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    url += `?${searchParams.toString()}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers,
  });

  return handleResponse<T>(response);
}

/**
 * POST 요청
 */
export async function apiPost<T>(
  endpoint: string,
  body?: any
): Promise<APIResponse<T>> {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  return handleResponse<T>(response);
}

/**
 * PATCH 요청
 */
export async function apiPatch<T>(
  endpoint: string,
  body: any
): Promise<APIResponse<T>> {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(body),
  });

  return handleResponse<T>(response);
}

/**
 * DELETE 요청
 */
export async function apiDelete<T>(
  endpoint: string
): Promise<APIResponse<T>> {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'DELETE',
    headers,
  });

  return handleResponse<T>(response);
}

export { APIError };
