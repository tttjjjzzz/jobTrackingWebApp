import {
  ApplicationStatus,
  STATUS_LABELS,
  STATUS_COLORS,
  type ApplicationStatusType,
} from '@jobtracker/shared';
import { useAppState } from '../../context/AppContext';

const allStatuses = Object.values(ApplicationStatus) as ApplicationStatusType[];

export function StatusFilter() {
  const { state, dispatch } = useAppState();
  const selected = state.filters.status;

  const toggle = (status: ApplicationStatusType) => {
    const next = selected.includes(status)
      ? selected.filter((s) => s !== status)
      : [...selected, status];
    dispatch({ type: 'SET_STATUS_FILTER', payload: next });
  };

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
        Status
      </h4>
      <div className="space-y-1">
        {allStatuses.map((s) => {
          const color = STATUS_COLORS[s];
          const active = selected.includes(s);
          return (
            <button
              key={s}
              onClick={() => toggle(s)}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-all hover:bg-white/5"
              style={{ color: active ? color : undefined }}
            >
              <span
                className="w-2.5 h-2.5 rounded-sm border transition-all"
                style={{
                  borderColor: color,
                  backgroundColor: active ? color : 'transparent',
                }}
              />
              <span
                className={
                  active
                    ? 'text-[var(--color-text-primary)]'
                    : 'text-[var(--color-text-secondary)]'
                }
              >
                {STATUS_LABELS[s]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
