import { Field, Int, ObjectType } from "type-graphql";

import { RideModel } from "./ride.model";

@ObjectType()
export class CountedRides {
  @Field(() => [RideModel])
  data: RideModel[];

  @Field(() => Int)
  total: number;
}
