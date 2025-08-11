import { Resolver, Mutation, Arg, Query, UseMiddleware } from "type-graphql";
import { Inject, Service } from "typedi";
import { UserModel } from "../model/user.model";
import { UserService } from "../service/user.service";
import { IsPrivate } from "../../../shared/decorators/private-route.decorator";

@Service()
@Resolver(() => UserModel)
export class UserResolver {
  constructor(
    @Inject(() => UserService)
    private readonly userService: UserService
  ) {}

  @Query(() => UserModel)
  @UseMiddleware(IsPrivate)
  async getUserById(@Arg("id") id: string) {
    return await this.userService.getUserById(id);
  }
}
