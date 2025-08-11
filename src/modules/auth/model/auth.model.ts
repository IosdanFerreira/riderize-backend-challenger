import { Field, ID, ObjectType } from "type-graphql";

import { UserModel } from "../../user/model/user.model";

@ObjectType()
export class AuthModel extends UserModel {
  @Field(() => String)
  access_token: string;
}
