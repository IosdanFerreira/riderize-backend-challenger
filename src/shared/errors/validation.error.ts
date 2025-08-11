import { GraphQLError } from "graphql";

export class ValidationError extends GraphQLError {
  constructor(
    message: string,
    errors?: { property: string; message?: string }[]
  ) {
    super(message, {
      extensions: {
        code: "VALIDATION_ERROR",
        message,
        errors_details: errors?.map((err) => ({
          property: err.property,
          message: err.message,
        })),
      },
    });

    this.name = "ValidationError";
  }
}
