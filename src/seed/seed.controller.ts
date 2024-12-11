import {
  Controller,
  Get,
  Logger,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SeedService } from './seed.service';
import { Auth, GetUser } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';
import { User } from '../auth/entities/user.entity';

@ApiTags('seed')
@Controller('seed')
export class SeedController {
  
  private readonly logger = new Logger('SeedController');

  constructor(private readonly seedService: SeedService) {}

  @Get()
  @Auth(ValidRoles.admin)
  @ApiResponse({ status: 200, description: 'Seed executed successfully' })
  @ApiResponse({ status: 403, description: 'Token related' })
  executedSeed(
    @GetUser() user: User
  ) {
    this.logger.log('Executing seed');
    return this.seedService.runSeed(user);
  }
}
