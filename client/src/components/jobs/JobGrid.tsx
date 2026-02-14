import type { JobApplication } from '@jobtracker/shared';
import { JobCard } from './JobCard';

interface JobGridProps {
  jobs: JobApplication[];
}

export function JobGrid({ jobs }: JobGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
