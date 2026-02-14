import { useQuery } from '@tanstack/react-query';
import { jobsApi } from '../api/jobs.api';

export function useJob(id: string | null) {
  return useQuery({
    queryKey: ['jobs', id],
    queryFn: () => jobsApi.getById(id!),
    enabled: !!id,
  });
}
