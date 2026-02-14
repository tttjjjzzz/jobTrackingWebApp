export const ApplicationStatus = {
  NOT_APPLIED: 'not_applied',
  APPLIED: 'applied',
  INTERVIEW: 'interview',
  REJECTED: 'rejected',
  ACCEPTED: 'accepted',
} as const;

export type ApplicationStatus =
  (typeof ApplicationStatus)[keyof typeof ApplicationStatus];

export const PositionType = {
  INTERNSHIP: 'internship',
  FULL_TIME: 'full_time',
  CO_OP: 'co_op',
  CONTRACT: 'contract',
  PART_TIME: 'part_time',
  FREELANCE: 'freelance',
} as const;

export type PositionType = (typeof PositionType)[keyof typeof PositionType];
