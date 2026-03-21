import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './contexts/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UserController } from './contexts/user/infrastructure/adapters/in/http/controllers/user.controller';
import { UserService } from './contexts/user/application/service/user.service';
import { InterestController } from './contexts/user/infrastructure/adapters/in/http/controllers/interest.controller';
import { InterestService } from './contexts/user/application/service/interest.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URI'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
})
export class AppModule { }
