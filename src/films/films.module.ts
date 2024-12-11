import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmsService } from './films.service';
import { FilmsController } from './films.controller';
import { Film } from './entities/film.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Film]),
    AuthModule
  ],
  controllers: [FilmsController],
  providers: [FilmsService],
  exports: [TypeOrmModule.forFeature([Film])],
})
export class FilmsModule {}
