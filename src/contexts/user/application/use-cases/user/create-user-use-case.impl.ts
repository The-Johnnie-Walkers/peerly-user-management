import { User } from '../../../domain/entities/user.entity';
import { CreateUserUseCase } from '../../../domain/ports/in/user/create-user-use-case.port';
import type { UserRepositoryOutPort } from '../../../domain/ports/out/user-repository-out.port';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CreateUserUseCaseImpl implements CreateUserUseCase {
  constructor(
    @Inject('UserRepositoryOutPortToken')
    private userRepositoryOutPort: UserRepositoryOutPort) { }

  async createUser(user: User): Promise<User> {
    return await this.userRepositoryOutPort.save(user);
  }
}
