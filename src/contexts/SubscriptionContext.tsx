/**
 * 구독 및 크레딧 관리 컨텍스트
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { 
  PlanType, 
  Plan, 
  Subscription, 
  Credits, 
  Schedule, 
  PLANS 
} from '../types/subscription';
import { isAuthenticated, getCurrentUser } from '../utils/googleAuth';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

interface SubscriptionContextType {
  // 구독 정보
  subscription: Subscription | null;
  currentPlan: Plan;
  isLoading: boolean;
  
  // 크레딧 정보
  credits: Credits | null;
  canGenerate: boolean;
  generationsRemaining: number;
  
  // 스케줄 정보
  schedules: Schedule[];
  canAddSchedule: boolean;
  
  // 액션
  refreshSubscription: () => Promise<void>;
  refreshCredits: () => Promise<void>;
  refreshSchedules: () => Promise<void>;
  useCredit: () => Promise<boolean>;
  
  // 스케줄 관리
  addSchedule: (schedule: Omit<Schedule, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<Schedule | null>;
  updateSchedule: (id: string, updates: Partial<Schedule>) => Promise<boolean>;
  deleteSchedule: (id: string) => Promise<boolean>;
  toggleSchedule: (id: string, isActive: boolean) => Promise<boolean>;
}

const defaultCredits: Credits = {
  userId: '',
  generationsUsed: 0,
  generationsLimit: 1,
  resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
};

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 현재 플랜 계산
  const currentPlan = subscription 
    ? PLANS[subscription.planId] 
    : PLANS.free;

  // 생성 가능 여부 계산
  const generationsRemaining = credits 
    ? (credits.generationsLimit === -1 
        ? Infinity 
        : credits.generationsLimit - credits.generationsUsed)
    : 1;
  
  const canGenerate = generationsRemaining > 0;

  // 스케줄 추가 가능 여부
  const canAddSchedule = currentPlan.features.schedulerEnabled && 
    (currentPlan.features.maxSchedules === -1 || 
     schedules.length < currentPlan.features.maxSchedules);

  // 구독 정보 새로고침
  const refreshSubscription = useCallback(async () => {
    if (!isAuthenticated()) {
      setSubscription(null);
      return;
    }

    try {
      const user = getCurrentUser();
      if (!user) return;

      const response = await fetch(`${API_BASE_URL}/api/subscriptions/user/${user.sub}`);
      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
      } else if (response.status === 404) {
        // 구독 없음 - Free 플랜
        setSubscription(null);
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
      // 오프라인 또는 API 오류 시 로컬 스토리지에서 복원
      const savedSubscription = localStorage.getItem('subscription');
      if (savedSubscription) {
        setSubscription(JSON.parse(savedSubscription));
      }
    }
  }, []);

  // 크레딧 정보 새로고침
  const refreshCredits = useCallback(async () => {
    if (!isAuthenticated()) {
      setCredits(defaultCredits);
      return;
    }

    try {
      const user = getCurrentUser();
      if (!user) return;

      const response = await fetch(`${API_BASE_URL}/api/credits/user/${user.sub}`);
      if (response.ok) {
        const data = await response.json();
        setCredits(data);
        localStorage.setItem('credits', JSON.stringify(data));
      } else {
        // API 없을 경우 로컬 기반 크레딧
        const localCredits = localStorage.getItem('credits');
        if (localCredits) {
          setCredits(JSON.parse(localCredits));
        } else {
          // subscription 상태를 직접 참조하지 않고 기본값 사용
          const planId = subscription?.planId || 'free';
          const plan = PLANS[planId];
          const newCredits = {
            ...defaultCredits,
            userId: user.sub,
            generationsLimit: plan.features.generationsPerMonth,
          };
          setCredits(newCredits);
          localStorage.setItem('credits', JSON.stringify(newCredits));
        }
      }
    } catch (error) {
      console.error('Failed to fetch credits:', error);
      // 로컬 스토리지 기반 폴백
      const localCredits = localStorage.getItem('credits');
      if (localCredits) {
        setCredits(JSON.parse(localCredits));
      } else {
        const planId = subscription?.planId || 'free';
        const plan = PLANS[planId];
        setCredits({
          ...defaultCredits,
          generationsLimit: plan.features.generationsPerMonth,
        });
      }
    }
  }, [subscription?.planId]);

  // 스케줄 목록 새로고침
  const refreshSchedules = useCallback(async () => {
    if (!isAuthenticated()) {
      setSchedules([]);
      return;
    }

    try {
      const user = getCurrentUser();
      if (!user) return;

      const response = await fetch(`${API_BASE_URL}/api/schedules/user/${user.sub}`);
      if (response.ok) {
        const data = await response.json();
        setSchedules(data);
        localStorage.setItem('schedules', JSON.stringify(data));
      } else {
        // 로컬 스토리지 폴백
        const localSchedules = localStorage.getItem('schedules');
        if (localSchedules) {
          setSchedules(JSON.parse(localSchedules));
        }
      }
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
      const localSchedules = localStorage.getItem('schedules');
      if (localSchedules) {
        setSchedules(JSON.parse(localSchedules));
      }
    }
  }, []);

  // 크레딧 사용
  const useCredit = useCallback(async (): Promise<boolean> => {
    if (!canGenerate || !credits) return false;

    try {
      const user = getCurrentUser();
      if (!user) return false;

      // API 호출
      const response = await fetch(`${API_BASE_URL}/api/credits/use`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.sub }),
      });

      if (response.ok) {
        await refreshCredits();
        return true;
      }
      
      // API 실패 시 로컬 처리
      const updatedCredits = {
        ...credits,
        generationsUsed: credits.generationsUsed + 1,
      };
      setCredits(updatedCredits);
      localStorage.setItem('credits', JSON.stringify(updatedCredits));
      return true;
    } catch (error) {
      console.error('Failed to use credit:', error);
      // 오프라인 시 로컬 처리
      if (credits) {
        const updatedCredits = {
          ...credits,
          generationsUsed: credits.generationsUsed + 1,
        };
        setCredits(updatedCredits);
        localStorage.setItem('credits', JSON.stringify(updatedCredits));
        return true;
      }
      return false;
    }
  }, [canGenerate, credits, refreshCredits]);

  // 스케줄 추가
  const addSchedule = useCallback(async (
    scheduleData: Omit<Schedule, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<Schedule | null> => {
    if (!canAddSchedule) return null;

    try {
      const user = getCurrentUser();
      if (!user) return null;

      const response = await fetch(`${API_BASE_URL}/api/schedules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...scheduleData, userId: user.sub }),
      });

      if (response.ok) {
        const newSchedule = await response.json();
        setSchedules(prev => [...prev, newSchedule]);
        return newSchedule;
      }

      // API 실패 시 로컬 처리
      const newSchedule: Schedule = {
        ...scheduleData,
        id: `local_${Date.now()}`,
        userId: user.sub,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updatedSchedules = [...schedules, newSchedule];
      setSchedules(updatedSchedules);
      localStorage.setItem('schedules', JSON.stringify(updatedSchedules));
      return newSchedule;
    } catch (error) {
      console.error('Failed to add schedule:', error);
      return null;
    }
  }, [canAddSchedule, schedules]);

  // 스케줄 업데이트
  const updateSchedule = useCallback(async (
    id: string, 
    updates: Partial<Schedule>
  ): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/schedules/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        await refreshSchedules();
        return true;
      }

      // 로컬 업데이트
      const updatedSchedules = schedules.map(s => 
        s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s
      );
      setSchedules(updatedSchedules);
      localStorage.setItem('schedules', JSON.stringify(updatedSchedules));
      return true;
    } catch (error) {
      console.error('Failed to update schedule:', error);
      return false;
    }
  }, [schedules, refreshSchedules]);

  // 스케줄 삭제
  const deleteSchedule = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/schedules/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSchedules(prev => prev.filter(s => s.id !== id));
        return true;
      }

      // 로컬 삭제
      const updatedSchedules = schedules.filter(s => s.id !== id);
      setSchedules(updatedSchedules);
      localStorage.setItem('schedules', JSON.stringify(updatedSchedules));
      return true;
    } catch (error) {
      console.error('Failed to delete schedule:', error);
      return false;
    }
  }, [schedules]);

  // 스케줄 활성/비활성
  const toggleSchedule = useCallback(async (
    id: string, 
    isActive: boolean
  ): Promise<boolean> => {
    return updateSchedule(id, { isActive });
  }, [updateSchedule]);

  // 초기 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        refreshSubscription(),
        refreshCredits(),
        refreshSchedules(),
      ]);
      setIsLoading(false);
    };

    loadData();
  }, [refreshSubscription, refreshCredits, refreshSchedules]);

  // 구독 정보 로컬 저장
  useEffect(() => {
    if (subscription) {
      localStorage.setItem('subscription', JSON.stringify(subscription));
    }
  }, [subscription]);

  const value: SubscriptionContextType = {
    subscription,
    currentPlan,
    isLoading,
    credits,
    canGenerate,
    generationsRemaining,
    schedules,
    canAddSchedule,
    refreshSubscription,
    refreshCredits,
    refreshSchedules,
    useCredit,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    toggleSchedule,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionContext;
