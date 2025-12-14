import { injectable } from 'tsyringe';
import { UseCase } from 'luminor';
import { User } from '../../domain/user.entity.js';
import { UserRepository } from '../../infrastructure/repositories/user.repository.js';

@injectable()
export class GetUserUseCase implements UseCase<string, User> {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}

