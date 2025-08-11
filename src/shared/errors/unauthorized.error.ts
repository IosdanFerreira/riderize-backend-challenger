export class UnauthorizedError extends Error {
  public readonly unauthorizedErrors?: {
    message?: string;
    property?: string;
    constraints?: Record<string, string>;
  }[];

  constructor(message: string) {
    super(message);
    this.unauthorizedErrors = [{ message }];
    this.name = "UNAUTHORIZED_ERROR";
  }
}
