import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class UserModel {
  @Field(type => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;
}
