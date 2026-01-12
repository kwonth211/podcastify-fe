/**
 * 스케줄 서비스
 */

import { apiGet, apiPost, apiPatch, apiDelete } from '../utils/apiClient';
import {
  Schedule,
  ScheduleCreate,
  ScheduleUpdate,
  SchedulesResponse,
  ScheduleTestResponse,
  DayOfWeek,
} from '../types/api';

/**
 * 요일 레이블 (i18n key)
 */
export const DAY_LABELS: Record<DayOfWeek, { ko: string; en: string; short: string }> = {
  monday: { ko: '월요일', en: 'Monday', short: 'Mon' },
  tuesday: { ko: '화요일', en: 'Tuesday', short: 'Tue' },
  wednesday: { ko: '수요일', en: 'Wednesday', short: 'Wed' },
  thursday: { ko: '목요일', en: 'Thursday', short: 'Thu' },
  friday: { ko: '금요일', en: 'Friday', short: 'Fri' },
  saturday: { ko: '토요일', en: 'Saturday', short: 'Sat' },
  sunday: { ko: '일요일', en: 'Sunday', short: 'Sun' },
};

/**
 * 모든 요일 배열
 */
export const ALL_DAYS: DayOfWeek[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

/**
 * 평일만
 */
export const WEEKDAYS: DayOfWeek[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
];

/**
 * 주말만
 */
export const WEEKENDS: DayOfWeek[] = ['saturday', 'sunday'];

/**
 * 시간대 목록
 */
export const TIMEZONES = [
  { value: 'Asia/Seoul', label: '서울 (KST, UTC+9)' },
  { value: 'America/New_York', label: 'New York (EST, UTC-5)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST, UTC-8)' },
  { value: 'Europe/London', label: 'London (GMT, UTC+0)' },
  { value: 'Europe/Paris', label: 'Paris (CET, UTC+1)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST, UTC+9)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST, UTC+8)' },
];

/**
 * 사용자 타임존 자동 감지
 */
export const getUserTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'Asia/Seoul';
  }
};

/**
 * 다음 실행 시간 계산
 */
export const calculateNextRun = (schedule: Schedule): Date | null => {
  if (!schedule.is_active || schedule.days.length === 0) {
    return null;
  }

  const now = new Date();
  const [hours, minutes] = schedule.time.split(':').map(Number);
  
  // 현재 요일 (0 = 일요일)
  const currentDay = now.getDay();
  const dayMapping: Record<DayOfWeek, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  const scheduleDays = schedule.days.map(d => dayMapping[d]).sort((a, b) => a - b);
  
  // 오늘 이후 가장 가까운 실행 요일 찾기
  let nextDay = scheduleDays.find(d => {
    if (d > currentDay) return true;
    if (d === currentDay) {
      const scheduleTime = new Date(now);
      scheduleTime.setHours(hours, minutes, 0, 0);
      return scheduleTime > now;
    }
    return false;
  });

  if (nextDay === undefined) {
    // 다음 주 첫 번째 스케줄 요일
    nextDay = scheduleDays[0];
  }

  const daysUntilNext = (nextDay - currentDay + 7) % 7 || (
    scheduleDays.includes(currentDay) && 
    new Date(now.setHours(hours, minutes, 0, 0)) > new Date() ? 0 : 7
  );

  const nextRun = new Date();
  nextRun.setDate(nextRun.getDate() + daysUntilNext);
  nextRun.setHours(hours, minutes, 0, 0);

  return nextRun;
};

/**
 * 스케줄 상태 텍스트
 */
export const getScheduleStatusText = (schedule: Schedule, lang: 'ko' | 'en' = 'ko'): string => {
  if (!schedule.is_active) {
    return lang === 'ko' ? '비활성' : 'Inactive';
  }

  const nextRun = calculateNextRun(schedule);
  if (!nextRun) {
    return lang === 'ko' ? '설정 필요' : 'Setup Required';
  }

  const now = new Date();
  const diffMs = nextRun.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return lang === 'ko' 
      ? `${diffDays}일 후 실행` 
      : `Runs in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
  }
  if (diffHours > 0) {
    return lang === 'ko' 
      ? `${diffHours}시간 후 실행` 
      : `Runs in ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
  }
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  return lang === 'ko' 
    ? `${diffMinutes}분 후 실행` 
    : `Runs in ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
};

/**
 * 스케줄 요약 텍스트 생성
 */
export const getScheduleSummary = (schedule: Schedule, lang: 'ko' | 'en' = 'ko'): string => {
  const daysText = schedule.days.length === 7
    ? (lang === 'ko' ? '매일' : 'Every day')
    : schedule.days.length === 5 && 
      WEEKDAYS.every(d => schedule.days.includes(d))
      ? (lang === 'ko' ? '평일' : 'Weekdays')
      : schedule.days.length === 2 && 
        WEEKENDS.every(d => schedule.days.includes(d))
        ? (lang === 'ko' ? '주말' : 'Weekends')
        : schedule.days.map(d => DAY_LABELS[d].short).join(', ');

  return `${daysText} ${schedule.time}`;
};

/**
 * 이메일 유효성 검사
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 모든 스케줄 조회
 */
export const getSchedules = async (activeOnly: boolean = false): Promise<Schedule[]> => {
  const response = await apiGet<SchedulesResponse>('/schedules/me', {
    active_only: activeOnly.toString(),
  });
  
  if (!response.data) {
    throw new Error('Failed to fetch schedules');
  }
  
  return response.data.schedules;
};

/**
 * 스케줄 조회 (단일)
 */
export const getSchedule = async (scheduleId: string): Promise<Schedule> => {
  const response = await apiGet<Schedule>(`/schedules/${scheduleId}`);
  
  if (!response.data) {
    throw new Error('Failed to fetch schedule');
  }
  
  return response.data;
};

/**
 * 스케줄 생성
 */
export const createSchedule = async (schedule: ScheduleCreate): Promise<Schedule> => {
  const response = await apiPost<Schedule>('/schedules', schedule);
  
  if (!response.data) {
    throw new Error('Failed to create schedule');
  }
  
  return response.data;
};

/**
 * 스케줄 수정
 */
export const updateSchedule = async (
  scheduleId: string,
  updates: ScheduleUpdate
): Promise<Schedule> => {
  const response = await apiPatch<Schedule>(`/schedules/${scheduleId}`, updates);
  
  if (!response.data) {
    throw new Error('Failed to update schedule');
  }
  
  return response.data;
};

/**
 * 스케줄 삭제
 */
export const deleteSchedule = async (scheduleId: string): Promise<void> => {
  await apiDelete(`/schedules/${scheduleId}`);
};

/**
 * 스케줄 활성화 상태 토글
 */
export const toggleSchedule = async (scheduleId: string): Promise<Schedule> => {
  const response = await apiPost<Schedule>(`/schedules/${scheduleId}/toggle`);
  
  if (!response.data) {
    throw new Error('Failed to toggle schedule');
  }
  
  return response.data;
};

/**
 * 스케줄 테스트 실행 (미리보기)
 */
export const testSchedule = async (scheduleId: string): Promise<ScheduleTestResponse> => {
  const response = await apiPost<ScheduleTestResponse>(`/schedules/${scheduleId}/test`);
  
  if (!response.data) {
    throw new Error('Failed to test schedule');
  }
  
  return response.data;
};
