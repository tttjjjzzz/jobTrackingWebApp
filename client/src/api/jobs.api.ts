import { api } from './client';
import type {
  JobApplication,
  CreateJobDTO,
  UpdateJobDTO,
  ApiResponse,
  ApiListResponse,
  JobsQueryParams,
} from '@jobtracker/shared';

function buildQueryString(params: JobsQueryParams): string {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set('search', params.search);
  if (params.status) {
    const statuses = Array.isArray(params.status) ? params.status : [params.status];
    statuses.forEach((s) => searchParams.append('status', s));
  }
  if (params.positionType) {
    const types = Array.isArray(params.positionType) ? params.positionType : [params.positionType];
    types.forEach((t) => searchParams.append('positionType', t));
  }
  if (params.applied !== undefined) searchParams.set('applied', String(params.applied));
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

export const jobsApi = {
  getAll(params: JobsQueryParams = {}) {
    return api.get<ApiListResponse<JobApplication>>(
      `/jobs${buildQueryString(params)}`,
    );
  },

  getById(id: string) {
    return api.get<ApiResponse<JobApplication>>(`/jobs/${id}`);
  },

  create(data: CreateJobDTO) {
    return api.post<ApiResponse<JobApplication>>('/jobs', data);
  },

  update(id: string, data: UpdateJobDTO) {
    return api.put<ApiResponse<JobApplication>>(`/jobs/${id}`, data);
  },

  updateStatus(id: string, status: string) {
    return api.patch<ApiResponse<JobApplication>>(`/jobs/${id}/status`, {
      status,
    });
  },

  delete(id: string) {
    return api.delete<ApiResponse<null>>(`/jobs/${id}`);
  },
};
