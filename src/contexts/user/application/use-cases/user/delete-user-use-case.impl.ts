import { DeleteUserUseCase } from '../../../domain/ports/in/user/delete-user-use-case.port';
import type { UserRepositoryOutPort } from '../../../domain/ports/out/user-repository-out.port';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class DeleteUserUseCaseImpl implements DeleteUserUseCase {
  constructor(
    @Inject('UserRepositoryOutPortToken')
    private userRepositoryOutPort: UserRepositoryOutPort) { }

  async deleteUserById(id: string): Promise<void> {
    await this.userRepositoryOutPort.deleteById(id);
    return Promise.resolve();
  }
}
