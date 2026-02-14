import { FilterBar } from '../filters/FilterBar';
import { useAppState } from '../../context/AppContext';
import { cn } from '../../utils/cn';

export function Sidebar() {
  const { state } = useAppState();

  return (
    <aside
      className={cn(
        'transition-all duration-300 ease-in-out overflow-hidden shrink-0',
        state.sidebarOpen ? 'w-56 opacity-100' : 'w-0 opacity-0',
      )}
    >
      <div className="w-56 glass p-4 h-fit sticky top-4">
        <FilterBar />
      </div>
    </aside>
  );
}
