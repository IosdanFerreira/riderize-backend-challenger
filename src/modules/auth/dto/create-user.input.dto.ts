import { Field, InputType } from "type-graphql";
import { IsEmail, IsString, Length, Matches } from "class-validator";

@InputType()
export class CreateUserInput {
  @Field()
  @IsString({ message: "O nome deve ser uma string" })
  @Length(2, 50, { message: "Nome deve ter entre 2 e 50 caracteres" })
  name: string;

  @Field()
  @IsEmail({}, { message: "Email inválido" })
  email: string;

  @Field()
  @IsString({ message: "A senha deve ser uma string" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
    message:
      "A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial.",
  })
  password: string;
}
