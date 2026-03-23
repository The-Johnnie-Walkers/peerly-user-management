import { User } from 'src/contexts/user/domain/entities/user.entity';
import { UpdateUserUseCase } from 'src/contexts/user/domain/ports/in/user/update-user-use-case.port';
import type { UserRepositoryOutPort } from 'src/contexts/user/domain/ports/out/user-repository-out.port';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UpdateUserUseCaseImpl implements UpdateUserUseCase {
  constructor(
    @Inject('UserRepositoryOutPortToken')
    private userRepositoryOutPort: UserRepositoryOutPort) { }

  async updateUser(id: string, user: User): Promise<User> {
    return await this.userRepositoryOutPort.update(id, user);
  }
}
