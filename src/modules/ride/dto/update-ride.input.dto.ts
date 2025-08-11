import { Field, InputType } from "type-graphql";

@InputType()
export class UpdateRideInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  start_date_registration?: Date;

  @Field({ nullable: true })
  end_date_registration?: Date;

  @Field({ nullable: true })
  start_date?: Date;

  @Field({ nullable: true })
  start_place?: string;

  @Field({ nullable: true })
  participants_limit?: number;

  @Field({ nullable: true })
  additional_information?: string;
}
