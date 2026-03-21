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
        InterestRepository
    ],

    exports: [

    ],

    controllers: [
        UserController
    ],
})
export class UserModule {

}