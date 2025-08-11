import { NotFoundError } from "../../../shared/errors/not-found.error";
import { Service } from "typedi";
import { UserModel } from "../model/user.model";
import { UserRepository } from "../repositories/user.repository";

@Service()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserById(id: string): Promise<UserModel> {
    const user = await this.userRepository.getById(id);

    if (!user) throw new NotFoundError("Usuário não encontrado");

    const formattedUser: UserModel = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    return formattedUser;
  }
}
