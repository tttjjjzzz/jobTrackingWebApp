import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  ApplicationStatus,
  STATUS_LABELS,
  STATUS_COLORS,
} from '@jobtracker/shared';
import { Badge } from '../ui/Badge';
import { useUpdateJobStatus } from '../../hooks/useJobMutations';

interface StatusBadgeProps {
  jobId: string;
  status: string;
  interactive?: boolean;
}

const allStatuses = Object.values(ApplicationStatus);

export function StatusBadge({
  jobId,
  status,
  interactive = true,
}: StatusBadgeProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const mutation = useUpdateJobStatus();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const color = STATUS_COLORS[status as keyof typeof STATUS_COLORS] || '#71717a';
  const label = STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status;

  if (!interactive) {
    return (
      <Badge color={color}>
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        {label}
      </Badge>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors hover:brightness-125"
        style={{
          backgroundColor: `${color}20`,
          color: color,
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        {label}
        <ChevronDown size={12} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 glass py-1 min-w-[140px]">
          {allStatuses.map((s) => {
            const sColor = STATUS_COLORS[s] || '#71717a';
            const sLabel = STATUS_LABELS[s] || s;
            return (
              <button
                key={s}
                onClick={(e) => {
                  e.stopPropagation();
                  mutation.mutate({ id: jobId, status: s });
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left hover:bg-white/10 transition-colors"
                style={{ color: status === s ? sColor : undefined }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: sColor }}
                />
                {sLabel}
                {status === s && (
                  <span className="ml-auto text-[10px] opacity-60">current</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
