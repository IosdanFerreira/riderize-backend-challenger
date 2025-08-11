import { Field, InputType, Int } from "type-graphql";

@InputType()
export class SubscribeToRideInput {
  @Field()
  ride_id: string;
}
