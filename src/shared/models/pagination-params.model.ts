import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export class PaginationParmasModel {
  @Field(() => Int)
  page: number;

  @Field(() => Int)
  per_page: number;
}
