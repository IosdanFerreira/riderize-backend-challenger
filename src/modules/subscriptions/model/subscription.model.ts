import { Field, ID, ObjectType } from "type-graphql";

import { RideModel } from "../../ride/models/ride.model";
import { UserModel } from "../../user/model/user.model";

@ObjectType()
export class SubscriptionModel {
  @Field(() => ID)
  id: string;

  @Field()
  ride_id: string;

  @Field(() => RideModel)
  ride: RideModel;

  @Field()
  user_id: string;

  @Field(() => UserModel)
  user: UserModel;

  @Field()
  subscription_date: Date;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}
