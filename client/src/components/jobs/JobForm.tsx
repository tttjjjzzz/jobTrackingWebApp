import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, Search, MapPin, Loader2 } from 'lucide-react';
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
import { CompanyLogo } from '../ui/CompanyLogo';
import { LogoPicker } from './LogoPicker';
import { LocationMap } from '../ui/LocationMap';
import { useCreateJob, useUpdateJob } from '../../hooks/useJobMutations';
import { useGeocode } from '../../hooks/useGeocode';
import { cn } from '../../utils/cn';

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

  const [showLogoPicker, setShowLogoPicker] = useState(false);
  const { geocode, isGeocoding } = useGeocode();

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
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
          logoUrl: job.logoUrl ?? null,
          location: job.location ?? null,
          locationLat: job.locationLat ?? null,
          locationLng: job.locationLng ?? null,
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
          logoUrl: null,
          location: null,
          locationLat: null,
          locationLng: null,
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'externalLinks' as any,
  });

  const positionType = watch('positionType');
  const applied = watch('applied');
  const statusValue = watch('status');
  const companyValue = watch('company');
  const logoUrlValue = watch('logoUrl');
  const locationValue = watch('location');
  const locationLatValue = watch('locationLat');
  const locationLngValue = watch('locationLng');
  const showLength = temporaryTypes.includes(positionType);
  const showAppliedSection = statusValue !== (ApplicationStatus.NOT_APPLIED as string);

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

  const handleGeocode = async () => {
    if (!locationValue?.trim()) {
      setValue('locationLat', null, { shouldDirty: true });
      setValue('locationLng', null, { shouldDirty: true });
      return;
    }
    const result = await geocode(locationValue);
    if (result) {
      setValue('locationLat', result.lat, { shouldDirty: true });
      setValue('locationLng', result.lng, { shouldDirty: true });
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

        {/* Company field with logo search */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="company"
              className="block text-sm font-medium text-[var(--color-text-secondary)]"
            >
              Company
            </label>
            {companyValue && (
              <button
                type="button"
                onClick={() => setShowLogoPicker((v) => !v)}
                className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)]"
              >
                <Search size={11} />
                {logoUrlValue ? 'Change logo' : 'Search logo'}
              </button>
            )}
          </div>
          <div className="relative">
            <div className="flex gap-2 items-center">
              {logoUrlValue && (
                <CompanyLogo
                  logoUrl={logoUrlValue}
                  company={companyValue || ''}
                  size="sm"
                  className="flex-shrink-0"
                />
              )}
              <input
                id="company"
                className={cn(
                  'glass-input flex-1',
                  errors.company &&
                    'border-red-500/50 focus:border-red-500 focus:ring-red-500/20',
                )}
                placeholder="e.g. Google"
                {...register('company')}
              />
            </div>
            {errors.company && (
              <p className="text-xs text-red-400 mt-1">
                {errors.company.message}
              </p>
            )}
            {showLogoPicker && companyValue && (
              <LogoPicker
                company={companyValue}
                currentLogoUrl={logoUrlValue}
                onSelect={(url) => {
                  setValue('logoUrl', url, { shouldDirty: true });
                  setShowLogoPicker(false);
                }}
                onClose={() => setShowLogoPicker(false)}
              />
            )}
          </div>
        </div>
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

      {/* Location */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
          Location
        </label>
        <div className="flex gap-2">
          <input
            className="glass-input flex-1"
            placeholder="e.g. San Francisco, CA or Remote"
            {...register('location')}
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleGeocode}
            disabled={!locationValue || isGeocoding}
          >
            {isGeocoding ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <MapPin size={14} />
            )}
            Locate
          </Button>
        </div>
        {locationLatValue != null && locationLngValue != null && (
          <LocationMap
            lat={locationLatValue}
            lng={locationLngValue}
            height="200px"
            interactive={true}
          />
        )}
      </div>

      {showAppliedSection && (
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
      )}

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
