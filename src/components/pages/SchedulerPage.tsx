/**
 * 스케줄러 페이지 - 자동 팟캐스트 생성 스케줄 관리
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '../dailyprompt/Navbar';
import Footer from '../dailyprompt/Footer';
import { 
  CalendarIcon, 
  ClockIcon, 
  EmailIcon, 
  PlusIcon, 
  TrashIcon, 
  EditIcon,
  CheckIcon,
  AlertIcon
} from '../common/Icons';
import { Schedule, DayOfWeek } from '../../types/subscription';
import { 
  ALL_DAYS, 
  WEEKDAYS, 
  DAY_LABELS, 
  TIMEZONES, 
  getUserTimezone,
  getScheduleSummary,
  getScheduleStatusText,
  validateEmail
} from '../../services/scheduleService';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { isAuthenticated } from '../../utils/googleAuth';

const Container = styled.div`
  min-height: 100vh;
  background: #f9fafb;
`;

const Main = styled.main`
  max-width: 1000px;
  margin: 0 auto;
  padding: 7rem 1.5rem 4rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: #111827;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 1rem;
`;

const QuotaCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
`;

const QuotaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const QuotaIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  background: #eef2ff;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const QuotaText = styled.div``;

const QuotaLabel = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
`;

const QuotaValue = styled.p`
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
`;

const UpgradeLink = styled.button`
  font-size: 0.875rem;
  color: #4f46e5;
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: #4338ca;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border: 2px dashed #e5e7eb;
  border-radius: 1rem;
`;

const EmptyIcon = styled.div`
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1rem;
  background: #f3f4f6;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EmptyTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const EmptyDescription = styled.p`
  color: #6b7280;
  margin-bottom: 1.5rem;
`;

const ScheduleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ScheduleCard = styled.div<{ $active: boolean }>`
  background: white;
  border: 1px solid ${props => props.$active ? '#c7d2fe' : '#e5e7eb'};
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.2s;

  ${props => !props.$active && `
    opacity: 0.7;
  `}

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;

const ScheduleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const ScheduleInfo = styled.div`
  flex: 1;
`;

const SchedulePrompt = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ScheduleMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: #6b7280;
`;

const StatusBadge = styled.span<{ $active: boolean }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => props.$active ? '#dcfce7' : '#f3f4f6'};
  color: ${props => props.$active ? '#166534' : '#6b7280'};
`;

const ScheduleActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ $danger?: boolean }>`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem;
  border: 1px solid ${props => props.$danger ? '#fecaca' : '#e5e7eb'};
  background: ${props => props.$danger ? '#fef2f2' : 'white'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$danger ? '#fee2e2' : '#f3f4f6'};
  }
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 3rem;
  height: 1.5rem;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background: #4f46e5;
  }

  &:checked + span:before {
    transform: translateX(1.5rem);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #e5e7eb;
  transition: 0.2s;
  border-radius: 1.5rem;

  &:before {
    position: absolute;
    content: '';
    height: 1.125rem;
    width: 1.125rem;
    left: 3px;
    bottom: 3px;
    background: white;
    transition: 0.2s;
    border-radius: 50%;
  }
`;

// 모달 스타일
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
`;

const Modal = styled.div`
  background: white;
  border-radius: 1.5rem;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
`;

const DaysSelector = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const DayButton = styled.button<{ $selected: boolean }>`
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: 2px solid ${props => props.$selected ? '#4f46e5' : '#e5e7eb'};
  background: ${props => props.$selected ? '#eef2ff' : 'white'};
  color: ${props => props.$selected ? '#4f46e5' : '#6b7280'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #4f46e5;
  }
`;

const QuickSelect = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const QuickButton = styled.button`
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: #f3f4f6;
  border: none;
  border-radius: 0.25rem;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e5e7eb;
    color: #374151;
  }
`;

const ModalFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid #e5e7eb;
  background: white;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
  }
`;

const SaveButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.span`
  font-size: 0.75rem;
  color: #dc2626;
  margin-top: 0.25rem;
  display: block;
`;

const SchedulerPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { 
    schedules, 
    canAddSchedule, 
    currentPlan, 
    addSchedule, 
    updateSchedule, 
    deleteSchedule, 
    toggleSchedule 
  } = useSubscription();

  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [formData, setFormData] = useState({
    prompt: '',
    days: WEEKDAYS as DayOfWeek[],
    time: '08:00',
    timezone: getUserTimezone(),
    email: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const lang = i18n.language === 'ko' ? 'ko' : 'en';

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

  const maxSchedules = currentPlan.features.maxSchedules;
  const usedSchedules = schedules.length;

  const openNewModal = () => {
    setEditingSchedule(null);
    setFormData({
      prompt: '',
      days: WEEKDAYS,
      time: '08:00',
      timezone: getUserTimezone(),
      email: '',
    });
    setErrors({});
    setShowModal(true);
  };

  const openEditModal = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      prompt: schedule.prompt,
      days: schedule.days,
      time: schedule.time,
      timezone: schedule.timezone,
      email: schedule.email,
    });
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSchedule(null);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.prompt.trim()) {
      newErrors.prompt = t('scheduler.errors.promptRequired');
    }

    if (formData.days.length === 0) {
      newErrors.days = t('scheduler.errors.daysRequired');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('scheduler.errors.emailRequired');
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t('scheduler.errors.emailInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSaving(true);

    try {
      if (editingSchedule) {
        await updateSchedule(editingSchedule.id, {
          prompt: formData.prompt,
          days: formData.days,
          time: formData.time,
          timezone: formData.timezone,
          email: formData.email,
        });
      } else {
        await addSchedule({
          prompt: formData.prompt,
          days: formData.days,
          time: formData.time,
          timezone: formData.timezone,
          email: formData.email,
          isActive: true,
        });
      }
      closeModal();
    } catch (error) {
      console.error('Failed to save schedule:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('scheduler.deleteConfirm'))) {
      await deleteSchedule(id);
    }
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    await toggleSchedule(id, !currentStatus);
  };

  const selectDays = (days: DayOfWeek[]) => {
    setFormData(prev => ({ ...prev, days }));
  };

  return (
    <Container>
      <Helmet>
        <title>{t('scheduler.pageTitle')} - DailyNewsPodcast</title>
      </Helmet>
      <Navbar />

      <Main>
        <Header>
          <HeaderTop>
            <div>
              <Title>{t('scheduler.title')}</Title>
              <Subtitle>{t('scheduler.subtitle')}</Subtitle>
            </div>
            <AddButton 
              onClick={openNewModal} 
              disabled={!canAddSchedule}
            >
              <PlusIcon size={18} />
              {t('scheduler.addSchedule')}
            </AddButton>
          </HeaderTop>
        </Header>

        <QuotaCard>
          <QuotaInfo>
            <QuotaIcon>
              <CalendarIcon size={24} color="#4f46e5" />
            </QuotaIcon>
            <QuotaText>
              <QuotaLabel>{t('scheduler.quotaLabel')}</QuotaLabel>
              <QuotaValue>
                {usedSchedules} / {maxSchedules === -1 ? '∞' : maxSchedules} {t('scheduler.schedules')}
              </QuotaValue>
            </QuotaText>
          </QuotaInfo>
          {!currentPlan.features.schedulerEnabled || maxSchedules <= usedSchedules ? (
            <UpgradeLink onClick={() => navigate('/pricing')}>
              {t('scheduler.upgrade')}
            </UpgradeLink>
          ) : null}
        </QuotaCard>

        {!currentPlan.features.schedulerEnabled ? (
          <EmptyState>
            <EmptyIcon>
              <AlertIcon size={32} color="#9ca3af" />
            </EmptyIcon>
            <EmptyTitle>{t('scheduler.upgradeRequired')}</EmptyTitle>
            <EmptyDescription>{t('scheduler.upgradeDescription')}</EmptyDescription>
            <AddButton onClick={() => navigate('/pricing')}>
              {t('scheduler.viewPlans')}
            </AddButton>
          </EmptyState>
        ) : schedules.length === 0 ? (
          <EmptyState>
            <EmptyIcon>
              <CalendarIcon size={32} color="#9ca3af" />
            </EmptyIcon>
            <EmptyTitle>{t('scheduler.emptyTitle')}</EmptyTitle>
            <EmptyDescription>{t('scheduler.emptyDescription')}</EmptyDescription>
            <AddButton onClick={openNewModal}>
              <PlusIcon size={18} />
              {t('scheduler.createFirst')}
            </AddButton>
          </EmptyState>
        ) : (
          <ScheduleList>
            {schedules.map(schedule => (
              <ScheduleCard key={schedule.id} $active={schedule.isActive}>
                <ScheduleHeader>
                  <ScheduleInfo>
                    <SchedulePrompt>{schedule.prompt}</SchedulePrompt>
                    <ScheduleMeta>
                      <MetaItem>
                        <CalendarIcon size={14} color="#6b7280" />
                        {getScheduleSummary(schedule, lang)}
                      </MetaItem>
                      <MetaItem>
                        <EmailIcon size={14} color="#6b7280" />
                        {schedule.email}
                      </MetaItem>
                      <StatusBadge $active={schedule.isActive}>
                        {getScheduleStatusText(schedule, lang)}
                      </StatusBadge>
                    </ScheduleMeta>
                  </ScheduleInfo>
                  <ScheduleActions>
                    <ToggleSwitch>
                      <ToggleInput 
                        type="checkbox" 
                        checked={schedule.isActive}
                        onChange={() => handleToggle(schedule.id, schedule.isActive)}
                      />
                      <ToggleSlider />
                    </ToggleSwitch>
                    <ActionButton onClick={() => openEditModal(schedule)}>
                      <EditIcon size={16} color="#6b7280" />
                    </ActionButton>
                    <ActionButton $danger onClick={() => handleDelete(schedule.id)}>
                      <TrashIcon size={16} color="#dc2626" />
                    </ActionButton>
                  </ScheduleActions>
                </ScheduleHeader>
              </ScheduleCard>
            ))}
          </ScheduleList>
        )}
      </Main>

      <Footer />

      {showModal && (
        <ModalOverlay onClick={closeModal}>
          <Modal onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                {editingSchedule ? t('scheduler.editSchedule') : t('scheduler.newSchedule')}
              </ModalTitle>
            </ModalHeader>

            <ModalBody>
              <FormGroup>
                <Label>{t('scheduler.form.prompt')}</Label>
                <Textarea
                  value={formData.prompt}
                  onChange={e => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
                  placeholder={t('scheduler.form.promptPlaceholder')}
                />
                {errors.prompt && <ErrorText>{errors.prompt}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label>{t('scheduler.form.days')}</Label>
                <QuickSelect>
                  <QuickButton onClick={() => selectDays(ALL_DAYS)}>
                    {t('scheduler.form.everyday')}
                  </QuickButton>
                  <QuickButton onClick={() => selectDays(WEEKDAYS)}>
                    {t('scheduler.form.weekdays')}
                  </QuickButton>
                </QuickSelect>
                <DaysSelector>
                  {ALL_DAYS.map(day => (
                    <DayButton
                      key={day}
                      $selected={formData.days.includes(day)}
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          days: prev.days.includes(day)
                            ? prev.days.filter(d => d !== day)
                            : [...prev.days, day]
                        }));
                      }}
                    >
                      {DAY_LABELS[day][lang]}
                    </DayButton>
                  ))}
                </DaysSelector>
                {errors.days && <ErrorText>{errors.days}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label>{t('scheduler.form.time')}</Label>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={e => setFormData(prev => ({ ...prev, time: e.target.value }))}
                />
              </FormGroup>

              <FormGroup>
                <Label>{t('scheduler.form.timezone')}</Label>
                <Select
                  value={formData.timezone}
                  onChange={e => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
                >
                  {TIMEZONES.map(tz => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>{t('scheduler.form.email')}</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder={t('scheduler.form.emailPlaceholder')}
                />
                {errors.email && <ErrorText>{errors.email}</ErrorText>}
              </FormGroup>
            </ModalBody>

            <ModalFooter>
              <CancelButton onClick={closeModal}>
                {t('scheduler.form.cancel')}
              </CancelButton>
              <SaveButton onClick={handleSubmit} disabled={isSaving}>
                {isSaving ? t('scheduler.form.saving') : t('scheduler.form.save')}
              </SaveButton>
            </ModalFooter>
          </Modal>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default SchedulerPage;
