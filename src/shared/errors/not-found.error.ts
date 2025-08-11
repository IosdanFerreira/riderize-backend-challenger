export class NotFoundError extends Error {
  public readonly notFoundErrors?: {
    message?: string;
    property?: string;
    constraints?: Record<string, string>;
  }[];

  constructor(message: string) {
    super(message);
    this.name = "NOT_FOUND_ERROR";
    this.notFoundErrors = [{ message }];
  }
}
