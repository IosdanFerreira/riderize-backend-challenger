export class ConflictError extends Error {
  public readonly extensions: {
    errors_details: {
      property: string;
      message?: string;
    }[];
  };

  constructor(
    errors: { property: string; constraints?: Record<string, string> }[]
  ) {
    super("Conflito entre os dados");
    this.name = "CONFLICT_ERROR";

    this.extensions = {
      errors_details: errors.map((error) => ({
        property: error.property,
        message: error.constraints
          ? Object.values(error.constraints)[0]
          : undefined,
      })),
    };
  }
}
