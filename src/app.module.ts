import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { envs } from './config';
import { CommonModule } from './common/common.module';
import { FilmsModule } from './films/films.module';
import { SeedModule } from './seed/seed.module';


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
    CommonModule,
    FilmsModule,
    SeedModule,
  ],
})
export class AppModule {}
