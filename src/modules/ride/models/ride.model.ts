// src/modules/rides/model/ride.model.ts
import { Field, ID, Int, ObjectType } from "type-graphql";

import { SubscriptionModel } from "../../subscriptions/model/subscription.model";
import { UserModel } from "../../user/model/user.model";

@ObjectType()
export class RideModel {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => Date)
  start_date: Date;

  @Field(() => Date)
  start_date_registration: Date;

  @Field(() => Date)
  end_date_registration: Date;

  @Field(() => String)
  start_place: string;

  @Field(() => String, { nullable: true })
  additional_information: string | null;

  @Field(() => Int, { nullable: true })
  participants_limit: number | null;

  @Field(() => String)
  creator_id: string;

  @Field(() => UserModel)
  creator: UserModel;

  @Field(() => [SubscriptionModel], { nullable: true })
  subscriptions?: SubscriptionModel[] | null;

  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at: Date;
}
