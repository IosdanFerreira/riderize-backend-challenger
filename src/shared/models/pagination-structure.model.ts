import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export class PaginationStructureModel {
  @Field(() => Int)
  total_items: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  per_page: number;

  @Field(() => Int)
  total_pages: number;

  @Field(() => Int, { nullable: true })
  next_page: number | null;

  @Field(() => Int, { nullable: true })
  prev_page: number | null;
}
