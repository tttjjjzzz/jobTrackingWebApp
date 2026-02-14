import { LayoutGrid, List } from 'lucide-react';
import { useAppState } from '../../context/AppContext';
import { cn } from '../../utils/cn';
import type { ViewMode } from '../../types/ui';

export function JobViewToggle() {
  const { state, dispatch } = useAppState();

  const toggle = (mode: ViewMode) => {
    dispatch({ type: 'SET_VIEW_MODE', payload: mode });
  };

  return (
    <div className="flex items-center glass-subtle p-1 rounded-lg">
      <button
        onClick={() => toggle('grid')}
        className={cn(
          'p-1.5 rounded-md transition-colors',
          state.viewMode === 'grid'
            ? 'bg-accent text-white'
            : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]',
        )}
        aria-label="Grid view"
      >
        <LayoutGrid size={16} />
      </button>
      <button
        onClick={() => toggle('list')}
        className={cn(
          'p-1.5 rounded-md transition-colors',
          state.viewMode === 'list'
            ? 'bg-accent text-white'
            : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]',
        )}
        aria-label="List view"
      >
        <List size={16} />
      </button>
    </div>
  );
}
