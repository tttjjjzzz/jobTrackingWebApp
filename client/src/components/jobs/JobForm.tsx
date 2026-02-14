import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import {
  createJobSchema,
  ApplicationStatus,
  PositionType,
  STATUS_LABELS,
  POSITION_TYPE_LABELS,
  type CreateJobInput,
  type JobApplication,
} from '@jobtracker/shared';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { TextArea } from '../ui/TextArea';
import { IconButton } from '../ui/IconButton';
import { useCreateJob, useUpdateJob } from '../../hooks/useJobMutations';

interface JobFormProps {
  job?: JobApplication | null;
  onClose: () => void;
}

const positionTypeOptions = Object.entries(POSITION_TYPE_LABELS).map(
  ([value, label]) => ({ value, label }),
);

const statusOptions = Object.entries(STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const temporaryTypes = [
  PositionType.INTERNSHIP,
  PositionType.CO_OP,
  PositionType.CONTRACT,
  PositionType.PART_TIME,
] as string[];

export function JobForm({ job, onClose }: JobFormProps) {
  const createMutation = useCreateJob();
  const updateMutation = useUpdateJob();
  const isEditing = !!job;

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<CreateJobInput>({
    resolver: zodResolver(createJobSchema),
    defaultValues: job
      ? {
          jobTitle: job.jobTitle,
          company: job.company,
          positionType: job.positionType as any,
          positionLength: job.positionLength,
          dateApplied: job.dateApplied?.slice(0, 10) ?? null,
          applied: job.applied,
          applicationLink: job.applicationLink,
          comments: job.comments,
          externalLinks: job.externalLinks ?? [],
          status: job.status as any,
        }
      : {
          jobTitle: '',
          company: '',
          positionType: PositionType.FULL_TIME as any,
          positionLength: null,
          dateApplied: null,
          applied: false,
          applicationLink: null,
          comments: null,
          externalLinks: [],
          status: ApplicationStatus.NOT_APPLIED as any,
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'externalLinks' as any,
  });

  const positionType = watch('positionType');
  const applied = watch('applied');
  const showLength = temporaryTypes.includes(positionType);

  const onSubmit = (data: CreateJobInput) => {
    if (isEditing) {
      updateMutation.mutate(
        { id: job!.id, data },
        { onSuccess: onClose },
      );
    } else {
      createMutation.mutate(data, { onSuccess: onClose });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="jobTitle"
          label="Job Title"
          placeholder="e.g. Software Engineer"
          error={errors.jobTitle?.message}
          {...register('jobTitle')}
        />
        <Input
          id="company"
          label="Company"
          placeholder="e.g. Google"
          error={errors.company?.message}
          {...register('company')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          id="positionType"
          label="Position Type"
          options={positionTypeOptions}
          error={errors.positionType?.message}
          {...register('positionType')}
        />
        {showLength && (
          <Input
            id="positionLength"
            label="Duration (months)"
            type="number"
            placeholder="e.g. 4"
            error={errors.positionLength?.message}
            {...register('positionLength', { valueAsNumber: true })}
          />
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          id="status"
          label="Status"
          options={statusOptions}
          error={errors.status?.message}
          {...register('status')}
        />
        <Input
          id="applicationLink"
          label="Application Link"
          type="url"
          placeholder="https://..."
          error={errors.applicationLink?.message}
          {...register('applicationLink')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="applied"
            className="w-4 h-4 rounded border-white/20 bg-white/5 text-accent focus:ring-accent/40"
            {...register('applied')}
          />
          <label
            htmlFor="applied"
            className="text-sm text-[var(--color-text-secondary)]"
          >
            Applied
          </label>
        </div>
        {applied && (
          <Input
            id="dateApplied"
            label="Date Applied"
            type="date"
            error={errors.dateApplied?.message}
            {...register('dateApplied')}
          />
        )}
      </div>

      <TextArea
        id="comments"
        label="Comments"
        placeholder="Any notes about this application..."
        rows={3}
        error={errors.comments?.message}
        {...register('comments')}
      />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
            External Links
          </label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => append('' as any)}
          >
            <Plus size={14} />
            Add Link
          </Button>
        </div>
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <Input
              placeholder="https://..."
              className="flex-1"
              {...register(`externalLinks.${index}` as any)}
            />
            <IconButton
              label="Remove link"
              onClick={() => remove(index)}
              className="mt-1"
            >
              <Trash2 size={14} />
            </IconButton>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}
