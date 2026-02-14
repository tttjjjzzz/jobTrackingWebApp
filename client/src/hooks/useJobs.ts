import { useQuery } from '@tanstack/react-query';
import { jobsApi } from '../api/jobs.api';
import type { JobsQueryParams } from '@jobtracker/shared';

export function useJobs(params: JobsQueryParams = {}) {
  return useQuery({
    queryKey: ['jobs', params],
    queryFn: () => jobsApi.getAll(params),
    staleTime: 30_000,
  });
}
