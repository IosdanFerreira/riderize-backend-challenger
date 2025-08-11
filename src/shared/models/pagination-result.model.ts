import { Field, ObjectType } from "type-graphql";

import { PaginationStructureModel } from "./pagination-structure.model";

@ObjectType()
export class PaginationResultModel<T extends object> {
  @Field(() => [Object])
  items: T[];

  @Field(() => PaginationStructureModel)
  pagination: PaginationStructureModel;
}
