import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [ UserModule, MongooseModule.forRoot('mongodb+srv://danpame1219_db_user:Sirha2025-2@sirhadb.iblyyvg.mongodb.net/peerly-users-management-db?retryWrites=true&w=majority')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
