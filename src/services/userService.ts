/**
 * 사용자 서비스
 */

import { apiGet, apiPatch, apiDelete } from '../utils/apiClient';
import { User, UserStats } from '../types/api';

/**
 * 현재 사용자 정보 조회
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiGet<User>('/auth/me');
  
  if (!response.data) {
    throw new Error('Failed to fetch user');
  }
  
  return response.data;
};

/**
 * 사용자 프로필 조회
 */
export const getUserProfile = async (): Promise<User> => {
  const response = await apiGet<User>('/users/me');
  
  if (!response.data) {
    throw new Error('Failed to fetch user profile');
  }
  
  return response.data;
};

/**
 * 사용자 통계 조회
 */
export const getUserStats = async (): Promise<UserStats> => {
  const response = await apiGet<UserStats>('/users/me/stats');
  
  if (!response.data) {
    throw new Error('Failed to fetch user stats');
  }
  
  return response.data;
};

/**
 * 사용자 프로필 업데이트
 */
export const updateUserProfile = async (updates: {
  name?: string;
  picture?: string;
}): Promise<User> => {
  const response = await apiPatch<User>('/users/me', updates);
  
  if (!response.data) {
    throw new Error('Failed to update user profile');
  }
  
  return response.data;
};

/**
 * 계정 삭제
 */
export const deleteAccount = async (): Promise<void> => {
  await apiDelete('/users/me');
};
