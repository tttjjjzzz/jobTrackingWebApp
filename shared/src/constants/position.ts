import { PositionType } from '../types/enums';

export const POSITION_TYPE_LABELS: Record<PositionType, string> = {
  [PositionType.INTERNSHIP]: 'Internship',
  [PositionType.FULL_TIME]: 'Full-Time',
  [PositionType.CO_OP]: 'Co-op',
  [PositionType.CONTRACT]: 'Contract',
  [PositionType.PART_TIME]: 'Part-Time',
  [PositionType.FREELANCE]: 'Freelance',
};
