import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

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

  findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;
    
    return this.userRepository.find({
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: string) {

    // let user: User;

    // if ( isUUID(term) ) {
    const user = await this.userRepository.findOneBy({ id });

    if ( !user ) 
      throw new NotFoundException(`User with ${ id } not found`);
    
    return user;
    // } else {
    //   const queryBuilder = this.userRepository.createQueryBuilder(); 
    //   user = await queryBuilder
    //     .where('UPPER(title) =:title or slug =:slug', {
    //       title: term.toUpperCase(),
    //       slug: term.toLowerCase(),
    //     }).getOne();
    // }


    // if ( !product ) 
    //   throw new NotFoundException(`Product with ${ term } not found`);

    // return product;

  }

  update(id: string, updateUserDto: UpdateUserDto) {

    // const user = this.findOne(id);
    // if ( !user ) 
    //   throw new BadRequestException('User not found');
    // return `This action updates a #${id} user`;
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
