export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static notFound(resource: string) {
    return new ApiError(404, `${resource} not found`);
  }

  static badRequest(message: string, details?: Record<string, string[]>) {
    return new ApiError(400, message, details);
  }
}
