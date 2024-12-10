
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';
import { CreateUserDto, LoginUserDto } from '../../src/auth/dto';
import { PaginationDto } from '../../src/common/dtos';
import { UnauthorizedException } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';



const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    login: jest.fn(),
    handleDBExceptions: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('Create a new user', async () => {
    const createUserDto: CreateUserDto = {
      fullName: 'John Doe',
      username: 'johndoe',
      password: 'Password@123',
    };
    
    const result = { id: '85ab41bf-322f-42bf-8f7d-7b63ee092917', ...createUserDto, token: 'mockJwtToken', isActive: true, roles: ['user'] };

    jest.spyOn(service, 'create').mockResolvedValue(result);

    expect(await controller.create(createUserDto)).toBe(result);
    expect(service.create).toHaveBeenCalledWith(createUserDto);
  });

  it('Login a user successfully', async () => {
    const loginUserDto: LoginUserDto = {
      username: 'johndoe',
      password: 'Password@123',
    };
    
    const result = { id: '85ab41bf-322f-42bf-8f7d-7b63ee092917', fullName: 'John Doe', username: 'johndoe', token: 'mockJwtToken', isActive: true, roles: ['user'] };

    jest.spyOn(service, 'login').mockResolvedValue(result);

    expect(await controller.login(loginUserDto)).toBe(result);
    expect(service.login).toHaveBeenCalledWith(loginUserDto);
  });

  it('should throw UnauthorizedException if login fails', async () => {
    const loginUserDto: LoginUserDto = {
      username: 'johndoe',
      password: 'wrongpassword',
    };

    jest.spyOn(service, 'login').mockRejectedValue(new UnauthorizedException());

    await expect(controller.login(loginUserDto)).rejects.toThrow(UnauthorizedException);
  });
    
});


