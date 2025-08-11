"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadUserInputExceptionFilter = void 0;
class BadUserInputExceptionFilter {
    catch(error) {
        // Extrai a mensagem original do erro
        const originalMessage = error.message;
        // Tenta extrair a propriedade e valor inválido da mensagem (regex simples)
        // Exemplo da mensagem: Variable "$input" got invalid value 1 at "input.name"; String cannot represent a non string value: 1
        const propertyMatch = originalMessage.match(/at "input\.([\w\d_]+)"/);
        const property = propertyMatch ? propertyMatch[1] : "input";
        const invalidValueMatch = originalMessage.match(/got invalid value (.+) at/);
        const invalidValue = invalidValueMatch ? invalidValueMatch[1] : undefined;
        return {
            message: "Erro de validação dos dados",
            locations: error.locations,
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
exports.BadUserInputExceptionFilter = BadUserInputExceptionFilter;
