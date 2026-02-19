import { useState, useRef, useEffect } from 'react';
import { Pencil, Trash2, ExternalLink, Calendar, MapPin, X } from 'lucide-react';
import type { JobApplication } from '@jobtracker/shared';
import { POSITION_TYPE_LABELS } from '@jobtracker/shared';
import { Card } from '../ui/Card';
import { IconButton } from '../ui/IconButton';
import { StatusBadge } from './StatusBadge';
import { CompanyLogo } from '../ui/CompanyLogo';
import { LocationMap } from '../ui/LocationMap';
import { formatRelativeDate, formatPositionLength } from '../../utils/format';
import { useAppState } from '../../context/AppContext';

interface JobCardProps {
  job: JobApplication;
}

export function JobCard({ job }: JobCardProps) {
  const { dispatch } = useAppState();
  const [showMapPopup, setShowMapPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showMapPopup) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowMapPopup(false); };
    const handleClick = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) setShowMapPopup(false);
    };
    document.addEventListener('keydown', handleKey);
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [showMapPopup]);

  return (
    <Card
      interactive
      className="p-5 flex flex-col gap-3"
      onDoubleClick={() => dispatch({ type: 'OPEN_EDITOR', payload: job.id })}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5 min-w-0 flex-1">
          <CompanyLogo
            logoUrl={job.logoUrl}
            company={job.company}
            size="md"
            className="mt-0.5"
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-[var(--color-text-primary)] truncate">
              {job.jobTitle}
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] truncate">
              {job.company}
            </p>
          </div>
        </div>
        <StatusBadge jobId={job.id} status={job.status} />
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-[var(--color-text-muted)]">
        <span className="glass-subtle px-2 py-0.5 rounded-md">
          {POSITION_TYPE_LABELS[job.positionType as keyof typeof POSITION_TYPE_LABELS] || job.positionType}
        </span>
        <span className="glass-subtle px-2 py-0.5 rounded-md">
          {formatPositionLength(job.positionLength, job.positionType)}
        </span>
      </div>

      {job.location && (
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (job.locationLat != null && job.locationLng != null) setShowMapPopup(true);
            }}
            className={`flex items-center gap-1 text-xs text-[var(--color-text-muted)] max-w-full ${job.locationLat != null ? 'hover:text-[var(--color-accent)] cursor-pointer' : 'cursor-default'}`}
          >
            <MapPin size={12} className="flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </button>

          {showMapPopup && job.locationLat != null && job.locationLng != null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/60" />
              <div
                ref={popupRef}
                className="relative glass w-full max-w-lg"
                style={{ background: 'rgba(20, 21, 28, 0.92)' }}
              >
                <div className="flex items-center justify-between p-4 pb-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-primary)]">
                    <MapPin size={14} className="text-[var(--color-accent)]" />
                    {job.location}
                  </div>
                  <IconButton label="Close" onClick={() => setShowMapPopup(false)}>
                    <X size={16} />
                  </IconButton>
                </div>
                <div className="px-4 pb-4">
                  <LocationMap
                    lat={job.locationLat}
                    lng={job.locationLng}
                    height="300px"
                    zoom={12}
                    interactive={true}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {job.comments && (
        <p className="text-xs text-[var(--color-text-muted)] line-clamp-2">
          {job.comments}
        </p>
      )}

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
        <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
          <Calendar size={12} />
          <span>{formatRelativeDate(job.dateAdded)}</span>
        </div>
        <div className="flex items-center gap-1">
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
    </Card>
  );
}
