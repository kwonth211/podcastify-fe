/**
 * 팟캐스트 서비스
 */

import { apiGet, apiPost, apiDelete } from '../utils/apiClient';
import {
  Podcast,
  PodcastDetail,
  PodcastGenerateRequest,
  PodcastGenerateResponse,
  PodcastStatusResponse,
  PodcastsResponse,
  PodcastStatus,
} from '../types/api';

/**
 * 사용자의 팟캐스트 목록 조회
 */
export const getPodcasts = async (
  status?: PodcastStatus,
  limit: number = 20,
  offset: number = 0
): Promise<{ podcasts: Podcast[]; total: number }> => {
  const params: Record<string, string> = {
    limit: limit.toString(),
    offset: offset.toString(),
  };
  
  if (status) {
    params.status = status;
  }

  const response = await apiGet<PodcastsResponse>('/podcasts/me', params);
  
  if (!response.data) {
    throw new Error('Failed to fetch podcasts');
  }
  
  return {
    podcasts: response.data.podcasts,
    total: response.data.total,
  };
};

/**
 * 팟캐스트 상세 조회
 */
export const getPodcast = async (podcastId: string): Promise<PodcastDetail> => {
  const response = await apiGet<PodcastDetail>(`/podcasts/${podcastId}`);
  
  if (!response.data) {
    throw new Error('Failed to fetch podcast');
  }
  
  return response.data;
};

/**
 * 팟캐스트 생성
 */
export const generatePodcast = async (
  request: PodcastGenerateRequest
): Promise<PodcastGenerateResponse> => {
  const response = await apiPost<PodcastGenerateResponse>('/podcasts/generate', request);
  
  if (!response.data) {
    throw new Error('Failed to generate podcast');
  }
  
  return response.data;
};

/**
 * 팟캐스트 상태 조회
 */
export const getPodcastStatus = async (podcastId: string): Promise<PodcastStatusResponse> => {
  const response = await apiGet<PodcastStatusResponse>(`/podcasts/${podcastId}/status`);
  
  if (!response.data) {
    throw new Error('Failed to fetch podcast status');
  }
  
  return response.data;
};

/**
 * 팟캐스트 재생 카운트 증가
 */
export const recordPlay = async (podcastId: string): Promise<void> => {
  await apiPost(`/podcasts/${podcastId}/play`);
};

/**
 * 팟캐스트 삭제
 */
export const deletePodcast = async (podcastId: string): Promise<void> => {
  await apiDelete(`/podcasts/${podcastId}`);
};

/**
 * 팟캐스트 상태 폴링
 */
export const pollPodcastStatus = async (
  podcastId: string,
  onUpdate?: (status: PodcastStatusResponse) => void,
  interval: number = 3000,
  maxAttempts: number = 100
): Promise<PodcastDetail> => {
  let attempts = 0;

  const poll = async (): Promise<PodcastDetail> => {
    if (attempts >= maxAttempts) {
      throw new Error('Polling timeout: Maximum attempts reached');
    }

    attempts++;
    const status = await getPodcastStatus(podcastId);

    if (onUpdate) {
      onUpdate(status);
    }

    if (status.status === 'completed') {
      return await getPodcast(podcastId);
    } else if (status.status === 'failed') {
      throw new Error(status.error_message || 'Podcast generation failed');
    }

    // 계속 폴링
    await new Promise(resolve => setTimeout(resolve, interval));
    return poll();
  };

  return poll();
};
