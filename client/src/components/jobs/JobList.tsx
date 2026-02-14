import type { JobApplication } from '@jobtracker/shared';
import { JobRow } from './JobRow';

interface JobListProps {
  jobs: JobApplication[];
}

export function JobList({ jobs }: JobListProps) {
  return (
    <div className="space-y-1">
      <div className="grid grid-cols-[2fr_1.5fr_120px_1fr_1fr_96px] gap-4 px-4 py-2 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
        <span>Position</span>
        <span>Type</span>
        <span>Status</span>
        <span>Date</span>
        <span>Applied</span>
        <span />
      </div>
      {jobs.map((job) => (
        <JobRow key={job.id} job={job} />
      ))}
    </div>
  );
}
