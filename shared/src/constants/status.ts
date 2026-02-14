import { ApplicationStatus } from '../types/enums';

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  [ApplicationStatus.NOT_APPLIED]: 'Not Applied',
  [ApplicationStatus.APPLIED]: 'Applied',
  [ApplicationStatus.INTERVIEW]: 'Interview',
  [ApplicationStatus.REJECTED]: 'Rejected',
  [ApplicationStatus.ACCEPTED]: 'Accepted',
};

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  [ApplicationStatus.NOT_APPLIED]: '#71717a',
  [ApplicationStatus.APPLIED]: '#3b82f6',
  [ApplicationStatus.INTERVIEW]: '#f59e0b',
  [ApplicationStatus.REJECTED]: '#ef4444',
  [ApplicationStatus.ACCEPTED]: '#22c55e',
};
