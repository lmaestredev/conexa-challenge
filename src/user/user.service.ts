import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

  private readonly logger = new Logger('UserService');
  constructor(

    @InjectRepository(User) 
    private readonly userRepository: Repository<User>,

  ) {}
  
  async create(createUserDto: CreateUserDto) {

    try {
      const product =  this.userRepository.create(createUserDto);
      await this.userRepository.save(product);
      return product;
    }catch(err){
      this.handleDBExceptions(err);
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  private handleDBExceptions(error: any) {
    if ( error.code === '23505' ) 
      throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error occured, check the logs for more information');
  }
}
