export class AppError extends Error {
  constructor(
    public message: string,
    public code: string,
    public statusCode: number = 500,
    public meta?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'AppError'
  }
}
