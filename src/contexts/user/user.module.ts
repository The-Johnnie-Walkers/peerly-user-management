import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchemaDefinition } from './infrastructure/adapters/out/persistence/entities/user.schema';
import { User } from './domain/entities/user.entity';
import { Interest } from './domain/entities/interest.entity';
import { InterestSchemaDefinition } from './infrastructure/adapters/out/persistence/entities/interest.schema';
import { UserMapper } from './infrastructure/adapters/out/persistence/mappers/user.mapper';
import { UserRepository } from './infrastructure/adapters/out/persistence/repositories/user/user.repository';
import { InterestRepository } from './infrastructure/adapters/out/persistence/repositories/interest/interest.repository';
import { UserController } from './infrastructure/adapters/in/http/controllers/user.controller';
import { InterestController } from './infrastructure/adapters/in/http/controllers/interest.controller';
import { UserService } from './application/service/user.service';
import { InterestService } from './application/service/interest.service';
import { UserDtoMapper } from './infrastructure/adapters/in/http/mapper/user-dto.mapper';
import { InterestDtoMapper } from './infrastructure/adapters/in/http/mapper/interest-dto.mapper';
import { CreateUserUseCaseImpl } from './application/use-cases/user/create-user-use-case.impl';
import { UpdateInterestUseCaseImpl } from './application/use-cases/interest/update-interest-use-case.impl';
import { DeleteUserUseCaseImpl } from './application/use-cases/user/delete-user-use-case.impl';
import { GetUserUseCaseImpl } from './application/use-cases/user/get-user-use-case.impl';
import { GetAllUsersUseCaseImpl } from './application/use-cases/user/get-all-users-use-case.impl';
import { UpdateUserUseCaseImpl } from './application/use-cases/user/update-user-use-case.impl';
import { CreateInterestUseCaseImpl } from './application/use-cases/interest/create-interest-use-case.impl';
import { DeleteInterestUseCaseImpl } from './application/use-cases/interest/delete-interest-use-case.impl';
import { GetInterestUseCaseImpl } from './application/use-cases/interest/get-interest-use-case.impl';
import { GetAllInterestsUseCaseImpl } from './application/use-cases/interest/get-all-interests-use-case.impl';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchemaDefinition },
      { name: Interest.name, schema: InterestSchemaDefinition },
    ]),
  ],
  providers: [
    UserMapper,
    UserRepository,
    InterestRepository,
    UserService,
    InterestService,
    UserDtoMapper,
    InterestDtoMapper,
    {
      provide: 'CreateUserUseCaseToken',
      useClass: CreateUserUseCaseImpl,
    },
    {
      provide: 'DeleteUserUseCaseToken',
      useClass: DeleteUserUseCaseImpl,
    },
    {
      provide: 'GetUserUseCaseToken',
      useClass: GetUserUseCaseImpl,
    },
    {
      provide: 'GetAllUsersUseCaseToken',
      useClass: GetAllUsersUseCaseImpl,
    },
    {
      provide: 'UpdateUserUseCaseToken',
      useClass: UpdateUserUseCaseImpl,
    },
    {
      provide: 'CreateInterestUseCaseToken',
      useClass: CreateInterestUseCaseImpl,
    },
    {
      provide: 'UpdateInterestUseCaseToken',
      useClass: UpdateInterestUseCaseImpl,
    },
    {
      provide: 'DeleteInterestUseCaseToken',
      useClass: DeleteInterestUseCaseImpl,
    },
    {
      provide: 'GetInterestUseCaseToken',
      useClass: GetInterestUseCaseImpl,
    },
    {
      provide: 'GetAllInterestsUseCaseToken',
      useClass: GetAllInterestsUseCaseImpl,
    },
    {
      provide: 'InterestRepositoryOutPortToken',
      useClass: InterestRepository,
    },
    {
      provide: 'UserRepositoryOutPortToken',
      useClass: UserRepository,
    }
  ],
  controllers: [UserController, InterestController],
})
export class UserModule { }
