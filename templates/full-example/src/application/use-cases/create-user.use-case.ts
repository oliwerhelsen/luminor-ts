import { UseCase } from "brewy";
import { createHash } from "crypto";
import { injectable } from "tsyringe";
import { User } from "../../domain/user.entity.js";
import { UserRepository } from "../../infrastructure/repositories/user.repository.js";
import { CreateUserDto } from "../dto/create-user.dto.js";

@injectable()
export class CreateUserUseCase implements UseCase<CreateUserDto, User> {
  constructor(private userRepository: UserRepository) {}

  async execute(input: CreateUserDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash password (in production, use bcrypt or similar)
    const passwordHash = createHash("sha256")
      .update(input.password)
      .digest("hex");

    // Create user entity
    const user = new User(input.email, input.name, passwordHash);

    // Save user
    return await this.userRepository.save(user);
  }
}
