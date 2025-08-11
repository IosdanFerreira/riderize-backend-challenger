import { Field, Int, ObjectType } from "type-graphql";

import { PaginationResultModel } from "../../../shared/models/pagination-result.model";
import { PaginationStructureModel } from "../../../shared/models/pagination-structure.model";
import { RideModel } from "./ride.model";

@ObjectType()
export class PaginatedRides implements PaginationResultModel<RideModel> {
  @Field(() => [RideModel])
  items: RideModel[];

  @Field(() => PaginationStructureModel)
  pagination: PaginationStructureModel;
}
