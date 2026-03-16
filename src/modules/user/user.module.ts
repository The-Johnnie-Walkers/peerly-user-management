import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchemaDefinition } from './infraestructure/adapters/out/persistence/entities/user.schema';
import { User } from './domain/entities/user.entity'
import { Interest } from './domain/entities/interest.entity';
import { InterestSchemaDefinition } from './infraestructure/adapters/out/persistence/entities/interest.schema';
import { UserMapper } from './infraestructure/adapters/out/persistence/mappers/user.mapper';
import { UserRepository } from './infraestructure/adapters/out/persistence/repositories/user.repository';
import { InterestRepository } from './infraestructure/adapters/out/persistence/repositories/interest.repository';
import { UserController } from './infraestructure/adapters/in/http/controllers/user.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: User.name, schema: UserSchemaDefinition},
            {name: Interest.name, schema: InterestSchemaDefinition}
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