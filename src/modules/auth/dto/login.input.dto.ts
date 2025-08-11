import { Field, InputType } from "type-graphql";
import { IsEmail, Length, Matches } from "class-validator";

@InputType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}
