import type { ApplicationStatus, PositionType } from './enums';

export interface JobApplication {
  id: string;
  jobTitle: string;
  company: string;
  positionType: PositionType;
  positionLength: number | null;
  dateAdded: string;
  dateApplied: string | null;
  applied: boolean;
  applicationLink: string | null;
  comments: string | null;
  externalLinks: string[];
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobDTO {
  jobTitle: string;
  company: string;
  positionType: PositionType;
  positionLength?: number | null;
  dateApplied?: string | null;
  applied?: boolean;
  applicationLink?: string | null;
  comments?: string | null;
  externalLinks?: string[];
  status?: ApplicationStatus;
}

export interface UpdateJobDTO extends Partial<CreateJobDTO> {}
