import { Pencil, Trash2, ExternalLink, MapPin } from 'lucide-react';
import type { JobApplication } from '@jobtracker/shared';
import { POSITION_TYPE_LABELS } from '@jobtracker/shared';
import { IconButton } from '../ui/IconButton';
import { StatusBadge } from './StatusBadge';
import { CompanyLogo } from '../ui/CompanyLogo';
import { formatDate } from '../../utils/format';
import { useAppState } from '../../context/AppContext';

interface JobRowProps {
  job: JobApplication;
}

export function JobRow({ job }: JobRowProps) {
  const { dispatch } = useAppState();

  return (
    <div
      className="glass-hover group grid grid-cols-[2fr_1fr_1fr_120px_1fr_1fr_96px] gap-4 items-center px-4 py-3 rounded-xl border border-transparent hover:border-white/10 cursor-pointer"
      onDoubleClick={() => dispatch({ type: 'OPEN_EDITOR', payload: job.id })}
    >
      <div className="flex items-center gap-2 min-w-0">
        <CompanyLogo
          logoUrl={job.logoUrl}
          company={job.company}
          size="sm"
        />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-sm text-[var(--color-text-primary)] truncate">
            {job.jobTitle}
          </p>
          <p className="text-xs text-[var(--color-text-muted)] truncate">
            {job.company}
          </p>
        </div>
      </div>

      <span className="text-xs text-[var(--color-text-secondary)] truncate">
        {POSITION_TYPE_LABELS[job.positionType as keyof typeof POSITION_TYPE_LABELS] || job.positionType}
      </span>

      <span className="text-xs text-[var(--color-text-muted)] truncate flex items-center gap-1">
        {job.location && (
          <>
            <MapPin size={10} className="flex-shrink-0" />
            {job.location}
          </>
        )}
      </span>

      <div className="justify-self-end">
        <StatusBadge jobId={job.id} status={job.status} />
      </div>

      <span className="text-xs text-[var(--color-text-muted)]">
        {formatDate(job.dateApplied || job.dateAdded)}
      </span>

      <span className="text-xs text-[var(--color-text-muted)]">
        {job.applied ? 'Applied' : 'Not applied'}
      </span>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
        {job.applicationLink && (
          <IconButton
            label="Open application"
            onClick={(e) => {
              e.stopPropagation();
              window.open(job.applicationLink!, '_blank');
            }}
          >
            <ExternalLink size={14} />
          </IconButton>
        )}
        <IconButton
          label="Edit"
          onClick={(e) => {
            e.stopPropagation();
            dispatch({ type: 'OPEN_EDITOR', payload: job.id });
          }}
        >
          <Pencil size={14} />
        </IconButton>
        <IconButton
          label="Delete"
          onClick={(e) => {
            e.stopPropagation();
            dispatch({ type: 'SET_DELETING', payload: job.id });
          }}
        >
          <Trash2 size={14} />
        </IconButton>
      </div>
    </div>
  );
}
