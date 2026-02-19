import { z } from 'zod';
import { ApplicationStatus, PositionType } from '../types/enums';

const statusValues = Object.values(ApplicationStatus) as [string, ...string[]];
const positionTypeValues = Object.values(PositionType) as [
  string,
  ...string[],
];

export const createJobSchema = z.object({
  jobTitle: z.string().min(1, 'Job title is required').max(200),
  company: z.string().min(1, 'Company is required').max(200),
  positionType: z.enum(positionTypeValues),
  positionLength: z.number().int().positive().nullable().optional().default(null),
  dateApplied: z.string().nullable().optional().default(null),
  applied: z.boolean().optional().default(false),
  applicationLink: z
    .string()
    .url('Must be a valid URL')
    .nullable()
    .optional()
    .default(null),
  comments: z.string().max(5000).nullable().optional().default(null),
  externalLinks: z.array(z.string().url('Each link must be a valid URL')).optional().default([]),
  status: z.enum(statusValues).optional().default('not_applied'),
  logoUrl: z.string().url('Must be a valid URL').nullable().optional().default(null),
  location: z.string().max(500).nullable().optional().default(null),
  locationLat: z.number().min(-90).max(90).nullable().optional().default(null),
  locationLng: z.number().min(-180).max(180).nullable().optional().default(null),
});

export const updateJobSchema = createJobSchema.partial();

export const updateStatusSchema = z.object({
  status: z.enum(statusValues),
});

export const queryParamsSchema = z.object({
  search: z.string().optional(),
  status: z
    .union([z.enum(statusValues), z.array(z.enum(statusValues))])
    .optional(),
  positionType: z
    .union([z.enum(positionTypeValues), z.array(z.enum(positionTypeValues))])
    .optional(),
  applied: z
    .preprocess((v) => v === 'true' || v === true, z.boolean())
    .optional(),
  sortBy: z
    .enum([
      'dateAdded',
      'dateApplied',
      'company',
      'jobTitle',
      'status',
      'updatedAt',
    ])
    .optional()
    .default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
export type QueryParamsInput = z.infer<typeof queryParamsSchema>;
