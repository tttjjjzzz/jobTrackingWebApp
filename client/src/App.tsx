import { useEffect, useMemo } from 'react';
import type { JobApplication, JobsQueryParams } from '@jobtracker/shared';
import { AppProvider, useAppState } from './context/AppContext';
import { MainLayout } from './components/layout/MainLayout';
import { JobGrid } from './components/jobs/JobGrid';
import { JobList } from './components/jobs/JobList';
import { JobForm } from './components/jobs/JobForm';
import { Modal } from './components/ui/Modal';
import { ConfirmDialog } from './components/ui/ConfirmDialog';
import { Spinner } from './components/ui/Spinner';
import { EmptyState } from './components/ui/EmptyState';
import { Button } from './components/ui/Button';
import { useJobs } from './hooks/useJobs';
import { useDeleteJob } from './hooks/useJobMutations';
import { useDebounce } from './hooks/useDebounce';
import { Plus } from 'lucide-react';

function JobsDashboard() {
  const { state, dispatch } = useAppState();
  const debouncedSearch = useDebounce(state.filters.search, 300);

  const queryParams: JobsQueryParams = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      status: state.filters.status.length > 0 ? state.filters.status : undefined,
      sortBy: state.sort.sortBy as any,
      sortOrder: state.sort.sortOrder,
    }),
    [debouncedSearch, state.filters.status, state.sort],
  );

  const { data, isLoading, isError, refetch } = useJobs(queryParams);
  const deleteMutation = useDeleteJob();

  const jobs: JobApplication[] = data?.data ?? [];
  const editingJob =
    state.editingJobId && state.editingJobId !== 'new'
      ? jobs.find((j) => j.id === state.editingJobId) ?? null
      : null;

  // Keyboard shortcut: Ctrl/Cmd + N to create
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        dispatch({ type: 'OPEN_EDITOR', payload: 'new' });
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  return (
    <MainLayout>
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : isError ? (
        <EmptyState
          title="Failed to load applications"
          description="Something went wrong. Please try again."
        >
          <Button variant="secondary" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </EmptyState>
      ) : jobs.length === 0 ? (
        <EmptyState
          title={
            state.filters.search || state.filters.status.length > 0
              ? 'No matching applications'
              : 'No applications yet'
          }
          description={
            state.filters.search || state.filters.status.length > 0
              ? 'Try adjusting your filters.'
              : 'Add your first job application to get started.'
          }
        >
          {!state.filters.search && state.filters.status.length === 0 && (
            <Button
              size="sm"
              onClick={() => dispatch({ type: 'OPEN_EDITOR', payload: 'new' })}
            >
              <Plus size={16} />
              Add Job
            </Button>
          )}
        </EmptyState>
      ) : state.viewMode === 'grid' ? (
        <JobGrid jobs={jobs} />
      ) : (
        <JobList jobs={jobs} />
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={state.editingJobId !== null}
        onClose={() => dispatch({ type: 'CLOSE_EDITOR' })}
        title={state.editingJobId === 'new' ? 'New Application' : 'Edit Application'}
      >
        <JobForm
          key={state.editingJobId}
          job={editingJob}
          onClose={() => dispatch({ type: 'CLOSE_EDITOR' })}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={state.deletingJobId !== null}
        onClose={() => dispatch({ type: 'SET_DELETING', payload: null })}
        onConfirm={() => {
          if (state.deletingJobId) {
            deleteMutation.mutate(state.deletingJobId, {
              onSuccess: () =>
                dispatch({ type: 'SET_DELETING', payload: null }),
            });
          }
        }}
        title="Delete Application"
        description="Are you sure you want to delete this application? This action cannot be undone."
        loading={deleteMutation.isPending}
      />
    </MainLayout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <JobsDashboard />
    </AppProvider>
  );
}
