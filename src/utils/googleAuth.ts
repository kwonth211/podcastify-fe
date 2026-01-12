/**
 * Google OAuth 인증 유틸리티 (Supabase Auth 사용)
 */

import { supabase } from './apiClient';
import { User } from '../types/api';

export interface GoogleUser {
  email: string;
  name: string;
  picture: string;
  sub: string; // Google user ID
}

/**
 * Google OAuth 로그인 시작
 * @returns Promise<GoogleUser>
 */
export const signInWithGoogle = async (): Promise<GoogleUser> => {
  if (!supabase) {
    throw new Error('Supabase가 설정되지 않았습니다.');
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    throw new Error(error.message || 'Google 로그인에 실패했습니다.');
  }

  // OAuth URL로 리다이렉트
  if (data.url) {
    window.location.href = data.url;
  }

  // 이 부분은 실제로는 리다이렉트되므로 실행되지 않지만 타입을 위해 유지
  throw new Error('Redirecting to Google...');
};

/**
 * 현재 로그인된 사용자 정보 가져오기
 */
export const getCurrentUser = async (): Promise<User | null> => {
  if (!supabase) {
    return null;
  }

  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return null;
  }

        // API를 통해 사용자 정보 가져오기
        try {
          // 로컬 개발 환경일 때는 항상 로컬 API 사용
          const apiBase = import.meta.env.DEV
            ? (import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v2')
            : (import.meta.env.VITE_API_URL || 'https://api.dailynewspod.com/api/v2');
          
          const response = await fetch(`${apiBase}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
            },
          });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result.data || null;
  } catch {
    return null;
  }
};

/**
 * 로그인 상태 확인
 */
export const isAuthenticated = async (): Promise<boolean> => {
  if (!supabase) {
    return false;
  }

  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};

/**
 * 로그아웃
 */
export const signOut = async (): Promise<void> => {
  if (!supabase) {
    return;
  }

  await supabase.auth.signOut();
};

/**
 * 세션 새로고침
 */
export const refreshSession = async (): Promise<void> => {
  if (!supabase) {
    return;
  }

  await supabase.auth.refreshSession();
};
