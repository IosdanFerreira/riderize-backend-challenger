export class InvalidCredentialsError extends Error {
  public readonly invalidCredentialsErrors: {
    message?: string;
    property?: string;
    constraints?: Record<string, string>;
  }[];

  constructor(message: string) {
    super(message);
    this.name = "INVALID_CREDENTIALS_ERROR";
    this.invalidCredentialsErrors = [{ message }];
  }
}
