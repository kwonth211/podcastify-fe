/**
 * 크레딧 서비스
 */

import { apiGet } from '../utils/apiClient';
import { Credits, BatchTokens } from '../types/api';

/**
 * 온디맨드 크레딧 조회
 */
export const getCredits = async (): Promise<Credits> => {
  const response = await apiGet<Credits>('/credits/me');
  
  if (!response.data) {
    throw new Error('Failed to fetch credits');
  }
  
  return response.data;
};

/**
 * 배치 토큰 조회
 */
export const getBatchTokens = async (): Promise<BatchTokens> => {
  const response = await apiGet<BatchTokens>('/credits/batch-tokens/me');
  
  if (!response.data) {
    throw new Error('Failed to fetch batch tokens');
  }
  
  return response.data;
};
