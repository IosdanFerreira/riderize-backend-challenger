import { NotFoundError } from "../../../shared/errors/not-found.error";
import { RideRepository } from "../../ride/repositories/ride.repository";
import { Service } from "typedi";
import { SubscriptionRepository } from "../repositories/subscription.repository";
import { ValidationError } from "../../../shared/errors/validation.error";

@Service()
export class SubscriptionService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly rideRepository: RideRepository
  ) {}

  /**
   * Inscreve o usuário em um pedal (ride).
   * Aplica todas as regras de negócio exigidas pelo desafio.
   */
  async subscribeToRide(ride_id: string, user_id: string) {
    const ride = await this.rideRepository.findById(ride_id);

    if (!ride) {
      throw new NotFoundError("Pedal não encontrado");
    }

    const now = new Date();

    // Valida período de inscrição
    if (now < ride.start_date_registration) {
      throw new ValidationError("Período de inscrição ainda não começou", [
        {
          property: "start_date_registration",
          message: "Período de inscrição ainda não chegou",
        },
      ]);
    }

    if (now > ride.end_date_registration) {
      throw new ValidationError("Período de inscrição encerrado", [
        {
          property: "end_date_registration",
          message: "Período de inscrição encerrado",
        },
      ]);
    }

    // Evitar duplicidade na inscrição
    const alreadySubscribed = await this.subscriptionRepository.findFirst(
      ride_id,
      user_id
    );
    if (alreadySubscribed) {
      throw new Error("Usuário já está inscrito nesse pedal");
    }

    // Valida limite de participantes (se existir)
    const currentSubscriptions = ride.subscriptions?.length ?? 0;
    if (
      ride.participants_limit &&
      ride.participants_limit &&
      currentSubscriptions >= ride.participants_limit
    ) {
      throw new Error("Limite de participantes atingido");
    }

    // 5. Criar inscrição
    return await this.subscriptionRepository.create({ ride_id }, user_id);
  }

  /**
   * Lista todos os pedais que um usuário se inscreveu.
   */
  async getAllRidesSubscribedByUser(user_id: string) {
    const subscriptions = await this.subscriptionRepository.findManyByUserId(
      user_id
    );
    return subscriptions.map((s) => s.ride);
  }
}
