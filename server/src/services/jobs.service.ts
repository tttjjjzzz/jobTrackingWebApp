import { eq, like, inArray, and, or, asc, desc, sql, type SQL } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
import { db } from '../db/connection';
import { jobs } from '../db/schema';
import { ApiError } from '../utils/ApiError';
import type {
  CreateJobInput,
  UpdateJobInput,
  QueryParamsInput,
} from '@jobtracker/shared';
import type { ApplicationStatus } from '@jobtracker/shared';

function parseJob(row: any) {
  return {
    ...row,
    externalLinks:
      typeof row.externalLinks === 'string'
        ? JSON.parse(row.externalLinks)
        : row.externalLinks ?? [],
  };
}

const sortColumns = {
  dateAdded: jobs.dateAdded,
  dateApplied: jobs.dateApplied,
  company: jobs.company,
  jobTitle: jobs.jobTitle,
  status: jobs.status,
  updatedAt: jobs.updatedAt,
} as const;

export class JobsService {
  getAllJobs(params: QueryParamsInput) {
    const conditions: SQL[] = [];

    if (params.search) {
      const term = `%${params.search}%`;
      conditions.push(
        or(
          like(jobs.jobTitle, term),
          like(jobs.company, term),
          like(jobs.comments, term),
        )!,
      );
    }

    if (params.status) {
      const statuses = Array.isArray(params.status)
        ? params.status
        : [params.status];
      conditions.push(inArray(jobs.status, statuses));
    }

    if (params.positionType) {
      const types = Array.isArray(params.positionType)
        ? params.positionType
        : [params.positionType];
      conditions.push(inArray(jobs.positionType, types));
    }

    if (params.applied !== undefined) {
      conditions.push(eq(jobs.applied, params.applied));
    }

    const sortCol =
      sortColumns[params.sortBy as keyof typeof sortColumns] || jobs.updatedAt;
    const sortDir = params.sortOrder === 'asc' ? asc : desc;

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const results = db
      .select()
      .from(jobs)
      .where(where)
      .orderBy(sortDir(sortCol))
      .all();

    return { data: results.map(parseJob), total: results.length };
  }

  getJobById(id: string) {
    const job = db.select().from(jobs).where(eq(jobs.id, id)).get();
    if (!job) throw ApiError.notFound('Job');
    return parseJob(job);
  }

  createJob(data: CreateJobInput) {
    const now = new Date().toISOString();
    const id = uuid();

    const newJob = {
      id,
      jobTitle: data.jobTitle,
      company: data.company,
      positionType: data.positionType,
      positionLength: data.positionLength ?? null,
      dateAdded: now,
      dateApplied: data.dateApplied ?? null,
      applied: data.applied ?? false,
      applicationLink: data.applicationLink ?? null,
      comments: data.comments ?? null,
      externalLinks: JSON.stringify(data.externalLinks ?? []),
      status: data.status ?? 'not_applied',
      createdAt: now,
      updatedAt: now,
    };

    db.insert(jobs).values(newJob as any).run();

    return this.getJobById(id);
  }

  updateJob(id: string, data: UpdateJobInput) {
    const existing = this.getJobById(id);

    const updates: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    if (data.jobTitle !== undefined) updates.jobTitle = data.jobTitle;
    if (data.company !== undefined) updates.company = data.company;
    if (data.positionType !== undefined) updates.positionType = data.positionType;
    if (data.positionLength !== undefined) updates.positionLength = data.positionLength;
    if (data.dateApplied !== undefined) updates.dateApplied = data.dateApplied;
    if (data.applied !== undefined) updates.applied = data.applied;
    if (data.applicationLink !== undefined) updates.applicationLink = data.applicationLink;
    if (data.comments !== undefined) updates.comments = data.comments;
    if (data.externalLinks !== undefined)
      updates.externalLinks = JSON.stringify(data.externalLinks);
    if (data.status !== undefined) updates.status = data.status;

    db.update(jobs).set(updates).where(eq(jobs.id, id)).run();

    return this.getJobById(id);
  }

  updateJobStatus(id: string, status: ApplicationStatus) {
    this.getJobById(id); // Throws if not found
    db.update(jobs)
      .set({ status, updatedAt: new Date().toISOString() })
      .where(eq(jobs.id, id))
      .run();
    return this.getJobById(id);
  }

  deleteJob(id: string) {
    this.getJobById(id); // Throws if not found
    db.delete(jobs).where(eq(jobs.id, id)).run();
  }
}

export const jobsService = new JobsService();
