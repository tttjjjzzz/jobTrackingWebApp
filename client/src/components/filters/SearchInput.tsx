import { Search, X } from 'lucide-react';
import { useAppState } from '../../context/AppContext';
import { cn } from '../../utils/cn';

export function SearchInput({ className }: { className?: string }) {
  const { state, dispatch } = useAppState();

  return (
    <div className={cn('relative', className)}>
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
      />
      <input
        type="text"
        value={state.filters.search}
        onChange={(e) =>
          dispatch({ type: 'SET_SEARCH', payload: e.target.value })
        }
        placeholder="Search jobs..."
        className="glass-input pl-9 pr-8"
      />
      {state.filters.search && (
        <button
          onClick={() => dispatch({ type: 'SET_SEARCH', payload: '' })}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
