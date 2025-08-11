import { GraphQLError, GraphQLFormattedError, SourceLocation } from "graphql";

export class BadUserInputExceptionFilter {
  catch(error: GraphQLError): GraphQLFormattedError {
    // Extrai a mensagem original do erro
    const originalMessage = error.message;

    // Tenta extrair a propriedade e valor inválido da mensagem (regex simples)
    // Exemplo da mensagem: Variable "$input" got invalid value 1 at "input.name"; String cannot represent a non string value: 1
    const propertyMatch = originalMessage.match(/at "input\.([\w\d_]+)"/);
    const property = propertyMatch ? propertyMatch[1] : "input";

    const invalidValueMatch = originalMessage.match(
      /got invalid value (.+) at/
    );
    const invalidValue = invalidValueMatch ? invalidValueMatch[1] : undefined;

    return {
      message: "Erro de validação dos dados",
      locations: error.locations as SourceLocation[] | undefined,
      path: error.path,
      extensions: {
        code: "BAD_USER_INPUT",
        message: "Dados de entrada inválidos",
        errors_details: [
          {
            property,
            message: `Valor inválido fornecido: ${invalidValue}`,
          },
        ],
      },
    };
  }
}
