import { Plus } from 'lucide-react';
import {
  ApplicationStatus,
  STATUS_LABELS,
  STATUS_COLORS,
} from '@jobtracker/shared';
import type { ApplicationStatusType } from '@jobtracker/shared';
import { Button } from '../ui/Button';
import { SearchInput } from '../filters/SearchInput';
import { SortSelect } from '../filters/SortSelect';
import { JobViewToggle } from '../jobs/JobViewToggle';
import { useAppState } from '../../context/AppContext';
import { cn } from '../../utils/cn';

const statusTabs: { label: string; value: ApplicationStatusType | null }[] = [
  { label: 'All', value: null },
  { label: STATUS_LABELS[ApplicationStatus.APPLIED], value: ApplicationStatus.APPLIED },
  { label: STATUS_LABELS[ApplicationStatus.INTERVIEW], value: ApplicationStatus.INTERVIEW },
  { label: STATUS_LABELS[ApplicationStatus.REJECTED], value: ApplicationStatus.REJECTED },
  { label: STATUS_LABELS[ApplicationStatus.ACCEPTED], value: ApplicationStatus.ACCEPTED },
];

export function Header() {
  const { state, dispatch } = useAppState();

  const activeStatus =
    state.filters.status.length === 1 ? state.filters.status[0] : null;

  const handleTabClick = (value: ApplicationStatusType | null) => {
    dispatch({
      type: 'SET_STATUS_FILTER',
      payload: value ? [value] : [],
    });
  };

  return (
    <header className="px-6 pt-4 pb-2 space-y-3">
      {/* Top row: title, search, view toggle, add button */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-[var(--color-text-primary)] shrink-0">
          Job Tracker
        </h1>

        <SearchInput className="flex-1 max-w-md ml-auto" />

        <JobViewToggle />

        <Button
          size="sm"
          onClick={() => dispatch({ type: 'OPEN_EDITOR', payload: 'new' })}
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add Job</span>
        </Button>
      </div>

      {/* Bottom row: status tabs (left) + sort controls (right) */}
      <div className="flex items-center gap-4">
        <nav className="flex items-center gap-1">
          {statusTabs.map((tab) => {
            const isActive =
              tab.value === null
                ? state.filters.status.length === 0
                : activeStatus === tab.value;
            const color =
              tab.value !== null
                ? STATUS_COLORS[tab.value]
                : undefined;

            return (
              <button
                key={tab.label}
                onClick={() => handleTabClick(tab.value)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium',
                  isActive
                    ? 'text-[var(--color-text-primary)] bg-white/10'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-white/5',
                )}
                style={
                  isActive && color
                    ? { color, backgroundColor: `${color}15` }
                    : undefined
                }
              >
                {tab.value !== null && (
                  <span
                    className="inline-block w-2 h-2 rounded-full mr-1.5"
                    style={{
                      backgroundColor: color,
                      opacity: isActive ? 1 : 0.5,
                    }}
                  />
                )}
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="ml-auto w-56">
          <SortSelect />
        </div>
      </div>
    </header>
  );
}
