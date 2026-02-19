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
  logoUrl: string | null;
  location: string | null;
  locationLat: number | null;
  locationLng: number | null;
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
  logoUrl?: string | null;
  location?: string | null;
  locationLat?: number | null;
  locationLng?: number | null;
}

export interface UpdateJobDTO extends Partial<CreateJobDTO> {}
