import { injectable } from 'tsyringe';
import { UseCase } from 'luminor';
import { User } from '../../domain/user.entity.js';
import { UserRepository } from '../../infrastructure/repositories/user.repository.js';

@injectable()
export class ListUsersUseCase implements UseCase<void, User[]> {
  constructor(private userRepository: UserRepository) {}

  async execute(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
}

