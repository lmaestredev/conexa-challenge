import {
  Controller,
  Get,
  Logger,
} from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('seed')
export class SeedController {
  
  private readonly logger = new Logger('SeedController');


  constructor(private readonly seedService: SeedService) {}

  @Get()
  @Auth(ValidRoles.admin)
  executedSeed() {
    this.logger.log('Executing seed');
    return this.seedService.executedSeed();
  }
}
