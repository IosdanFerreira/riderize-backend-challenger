import {
  Resolver,
  Mutation,
  Arg,
  Ctx,
  UseMiddleware,
  Query,
} from "type-graphql";
import { Inject, Service } from "typedi";
import { IsPrivate } from "../../../shared/decorators/private-route.decorator";
import { SubscriptionModel } from "../model/subscription.model";
import { RideModel } from "../../ride/models/ride.model";
import { SubscriptionService } from "../services/subscription.service";
import { GraphQLContext } from "../../../shared/graphql/interfaces/context.interface";

@Service()
@Resolver(() => SubscriptionModel)
export class SubscriptionResolver {
  constructor(
    @Inject(() => SubscriptionService)
    private readonly subscriptionService: SubscriptionService
  ) {}

  /**
   * Inscreve o usuário logado em um pedal (ride)
   */
  @Mutation(() => SubscriptionModel)
  @UseMiddleware(IsPrivate)
  async subscribeToRide(
    @Arg("ride_id") ride_id: string,
    @Ctx() context: GraphQLContext
  ) {
    return this.subscriptionService.subscribeToRide(ride_id, context.user.id);
  }

  /**
   * Lista todos os pedais que o usuário logado se inscreveu
   */
  @Query(() => [RideModel])
  @UseMiddleware(IsPrivate)
  async mySubscribedRides(@Ctx() context: GraphQLContext) {
    return this.subscriptionService.getAllRidesSubscribedByUser(
      context.user.id
    );
  }
}
