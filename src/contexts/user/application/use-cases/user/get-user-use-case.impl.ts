import { User } from '../../../domain/entities/user.entity';
import { GetUserUseCase } from '../../../domain/ports/in/user/get-user-use-case.port';
import type { UserRepositoryOutPort } from '../../../domain/ports/out/user-repository-out.port';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetUserUseCaseImpl implements GetUserUseCase {
  constructor(
    @Inject('UserRepositoryOutPortToken')
    private userRepositoryOutPort: UserRepositoryOutPort) { }

  async getUserById(id: string): Promise<User> {
    return await this.userRepositoryOutPort.findById(id);
  }
}
