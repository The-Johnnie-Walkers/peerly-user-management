import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchemaDefinition } from './infrastructure/adapters/out/persistence/entities/user.schema';
import { User } from './domain/entities/user.entity'
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

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchemaDefinition },
            { name: Interest.name, schema: InterestSchemaDefinition }
        ]),
    ],
    providers: [
        UserMapper,
        UserRepository,
        InterestRepository,
        UserService,
        InterestService,
        UserDtoMapper,
        InterestDtoMapper
    ],
    controllers: [
        UserController,
        InterestController
    ],
})
export class UserModule {

}