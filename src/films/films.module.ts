import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmsService } from './films.service';
import { FilmsController } from './films.controller';
import { Film } from './entities/film.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Film])
  ],
  controllers: [FilmsController],
  providers: [FilmsService],
  exports: [
    TypeOrmModule.forFeature([Film])
  ]
})
export class FilmsModule {}
