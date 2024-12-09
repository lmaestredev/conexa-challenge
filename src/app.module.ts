import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { envs } from './config';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: envs.dbHost,
      port: envs.dbPort,
      database: envs.dbName,
      username: envs.dbUsername,
      password: envs.dbPassword,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
  ],
})
export class AppModule {}
