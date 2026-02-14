import { ArrowUpDown } from 'lucide-react';
import { useAppState } from '../../context/AppContext';

const sortOptions = [
  { value: 'updatedAt', label: 'Last Updated' },
  { value: 'dateAdded', label: 'Date Added' },
  { value: 'dateApplied', label: 'Date Applied' },
  { value: 'company', label: 'Company' },
  { value: 'jobTitle', label: 'Job Title' },
  { value: 'status', label: 'Status' },
];

export function SortSelect() {
  const { state, dispatch } = useAppState();

  const toggleOrder = () => {
    dispatch({
      type: 'SET_SORT',
      payload: {
        ...state.sort,
        sortOrder: state.sort.sortOrder === 'desc' ? 'asc' : 'desc',
      },
    });
  };

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
        Sort By
      </h4>
      <div className="flex gap-2">
        <select
          value={state.sort.sortBy}
          onChange={(e) =>
            dispatch({
              type: 'SET_SORT',
              payload: { ...state.sort, sortBy: e.target.value },
            })
          }
          className="glass-input flex-1 text-xs"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <button
          onClick={toggleOrder}
          className="glass-input px-2 flex items-center justify-center hover:border-accent transition-colors"
          title={state.sort.sortOrder === 'desc' ? 'Descending' : 'Ascending'}
        >
          <ArrowUpDown
            size={14}
            className={
              state.sort.sortOrder === 'asc' ? 'rotate-180' : ''
            }
          />
        </button>
      </div>
    </div>
  );
}
