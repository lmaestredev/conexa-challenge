import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { FilmsModule } from 'src/films/films.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [FilmsModule],
})
export class SeedModule {}
