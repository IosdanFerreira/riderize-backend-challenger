import { Field, InputType, Int } from "type-graphql";
import { IsDate, IsInt, IsOptional, IsString, Min } from "class-validator";

@InputType()
export class CreateRideInput {
  @Field()
  @IsString({ message: "O nome deve ser uma string" })
  name: string;

  @Field()
  @IsDate({ message: "A data de inicio do pedal deve ser do tipo date" })
  start_date: Date;

  @Field()
  @IsDate({ message: "A data de inicio das inscrições deve ser do tipo date" })
  start_date_registration: Date;

  @Field()
  @IsDate({ message: "A data de fim das inscrições deve ser do tipo date" })
  end_date_registration: Date;

  @Field()
  @IsString({ message: "O nome do local deve ser uma string" })
  start_place: string;

  @Field({ nullable: true })
  @IsString({ message: "A informação adicional deve ser uma string" })
  @IsOptional()
  additional_information?: string;

  @Field(() => Int, { nullable: true })
  @IsInt({ message: "O limite de participantes deve ser um number" })
  @Min(1, { message: "O limite de participantes deve ser maior que 0" })
  participants_limit?: number;
}
