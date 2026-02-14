import { Plus, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Button } from '../ui/Button';
import { IconButton } from '../ui/IconButton';
import { SearchInput } from '../filters/SearchInput';
import { JobViewToggle } from '../jobs/JobViewToggle';
import { useAppState } from '../../context/AppContext';

export function Header() {
  const { state, dispatch } = useAppState();

  return (
    <header className="flex items-center gap-4 px-6 py-4">
      <IconButton
        label="Toggle sidebar"
        onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
        className="shrink-0"
      >
        {state.sidebarOpen ? (
          <PanelLeftClose size={18} />
        ) : (
          <PanelLeftOpen size={18} />
        )}
      </IconButton>

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
    </header>
  );
}
