import { StatusFilter } from './StatusFilter';
import { SortSelect } from './SortSelect';

export function FilterBar() {
  return (
    <div className="space-y-6">
      <SortSelect />
      <StatusFilter />
    </div>
  );
}
