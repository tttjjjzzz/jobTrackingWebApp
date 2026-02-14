import type { ApplicationStatus, PositionType } from './enums';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiListResponse<T> {
  success: boolean;
  data: T[];
  total: number;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: Record<string, string[]>;
}

export interface JobsQueryParams {
  search?: string;
  status?: ApplicationStatus | ApplicationStatus[];
  positionType?: PositionType | PositionType[];
  applied?: boolean;
  sortBy?:
    | 'dateAdded'
    | 'dateApplied'
    | 'company'
    | 'jobTitle'
    | 'status'
    | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}
