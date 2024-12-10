import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import { PaginationDto } from 'src/common/dtos';
import { JwtPayload } from './interfaces/jwt-payload';

@Injectable()
export class AuthService {

  private readonly logger = new Logger('AuthService');
  
  constructor(

    @InjectRepository(User) 
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,

  ) {}
  
  async create(createUserDto: CreateUserDto) {

    try {
      this.logger.log(`Creating user with: ${ JSON.stringify(createUserDto) }`);

      const { password, ...userData } = createUserDto;

      const user =  this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
      
      await this.userRepository.save(user);
      delete user.password;

      this.logger.log(`User created with: ${ JSON.stringify(user) }`);
      return {
        ...user,
        token: this.getJwtToken({ id: user.id }),
      };
    }catch(err){
      this.handleDBExceptions(err);
    }
  }

  async login(loginUserDto: LoginUserDto){

    this.logger.log(`Logging user with: ${ JSON.stringify(loginUserDto) }`);

    const { username, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { username },
      select: {username: true, password: true, id: true},
    });

    if ( !user ) 
      throw new UnauthorizedException(`Credetenials for ${ username } are invalid`);
    
    if ( !user.password || !bcrypt.compareSync(password, user.password) ) 
      throw new UnauthorizedException('Invalid credentials');
    
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };

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

  private handleDBExceptions(error: any): never {
    if ( error.code === '23505' ) {
      this.logger.error(error.detail);
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error occured, check the logs for more information');
  }

  private getJwtToken(payload: JwtPayload) {
    
    const token = this.jwtService.sign(payload);

    return token;
  }
}
