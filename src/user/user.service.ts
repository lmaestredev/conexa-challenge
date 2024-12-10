import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos';

@Injectable()
export class UserService {

  private readonly logger = new Logger('UserService');
  constructor(

    @InjectRepository(User) 
    private readonly userRepository: Repository<User>,

  ) {}
  
  async create(createUserDto: CreateUserDto) {

    try {
      const user =  this.userRepository.create(createUserDto);
      await this.userRepository.save(user);
      return user;
    }catch(err){
      this.handleDBExceptions(err);
    }
  }

  findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;
    
    return this.userRepository.find({
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: string) {

    const user = await this.userRepository.findOneBy({ id });

    if ( !user ) 
      throw new NotFoundException(`User with ${ id } not found`);
    
    return user;
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  private handleDBExceptions(error: any) {
    if ( error.code === '23505' ) 
      throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error occured, check the logs for more information');
  }
}
