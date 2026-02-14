import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from 'react';
import type { ApplicationStatus, PositionType } from '@jobtracker/shared';
import type { ViewMode } from '../types/ui';

interface AppState {
  viewMode: ViewMode;
  filters: {
    search: string;
    status: ApplicationStatus[];
    positionType: PositionType[];
  };
  sort: {
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
  editingJobId: string | null; // null = closed, 'new' = creating, uuid = editing
  deletingJobId: string | null;
  sidebarOpen: boolean;
}

type Action =
  | { type: 'SET_VIEW_MODE'; payload: ViewMode }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_STATUS_FILTER'; payload: ApplicationStatus[] }
  | { type: 'SET_POSITION_TYPE_FILTER'; payload: PositionType[] }
  | { type: 'SET_SORT'; payload: { sortBy: string; sortOrder: 'asc' | 'desc' } }
  | { type: 'OPEN_EDITOR'; payload: string | null }
  | { type: 'CLOSE_EDITOR' }
  | { type: 'SET_DELETING'; payload: string | null }
  | { type: 'TOGGLE_SIDEBAR' };

const savedViewMode = (typeof localStorage !== 'undefined'
  ? localStorage.getItem('viewMode')
  : null) as ViewMode | null;

const initialState: AppState = {
  viewMode: savedViewMode || 'grid',
  filters: {
    search: '',
    status: [],
    positionType: [],
  },
  sort: {
    sortBy: 'updatedAt',
    sortOrder: 'desc',
  },
  editingJobId: null,
  deletingJobId: null,
  sidebarOpen: true,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_VIEW_MODE':
      localStorage.setItem('viewMode', action.payload);
      return { ...state, viewMode: action.payload };
    case 'SET_SEARCH':
      return { ...state, filters: { ...state.filters, search: action.payload } };
    case 'SET_STATUS_FILTER':
      return { ...state, filters: { ...state.filters, status: action.payload } };
    case 'SET_POSITION_TYPE_FILTER':
      return {
        ...state,
        filters: { ...state.filters, positionType: action.payload },
      };
    case 'SET_SORT':
      return { ...state, sort: action.payload };
    case 'OPEN_EDITOR':
      return { ...state, editingJobId: action.payload };
    case 'CLOSE_EDITOR':
      return { ...state, editingJobId: null };
    case 'SET_DELETING':
      return { ...state, deletingJobId: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: Dispatch<Action>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}
