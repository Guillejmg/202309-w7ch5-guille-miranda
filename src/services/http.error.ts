export class HttpError extends Error {
  constructor(
    // eslint-disable-next-line no-unused-vars
    public status: number,
    // eslint-disable-next-line no-unused-vars
    public statusMessage: string,
    message?: string,
    options?: ErrorOptions
  ) {
    super(message, options);
  }
}
