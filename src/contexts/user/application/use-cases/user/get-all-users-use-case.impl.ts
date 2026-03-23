import { User } from 'src/contexts/user/domain/entities/user.entity';
import { GetAllUsersUseCase } from 'src/contexts/user/domain/ports/in/user/get-all-users-use-case.port';
import type { UserRepositoryOutPort } from 'src/contexts/user/domain/ports/out/user-repository-out.port';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetAllUsersUseCaseImpl implements GetAllUsersUseCase {
  constructor(
    @Inject('UserRepositoryOutPortToken')
    private userRepositoryOutPort: UserRepositoryOutPort) { }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepositoryOutPort.findAll();
  }
}
