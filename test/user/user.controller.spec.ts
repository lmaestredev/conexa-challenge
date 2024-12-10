
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../src/user/user.controller';
import { UserService } from '../../src/user/user.service';
import { CreateUserDto } from '../../src/user/dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';



const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
};

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('Create a new user', async () => {
    const createUserDto: CreateUserDto = {
      name: 'John Doe',
      username: 'johndoe',
      password: 'Password@123',
    };
    const result = { id: '85ab41bf-322f-42bf-8f7d-7b63ee092917', ...createUserDto };
  
    jest.spyOn(service, 'create').mockResolvedValue(result);
  
    expect(await controller.create(createUserDto)).toBe(result);
    expect(service.create).toHaveBeenCalledWith(createUserDto);
  });
  
  it('Get all users with pagination', async () => {
    const paginationDto: PaginationDto = { limit: 10, offset: 0 };
    const result = [
      { id: '85ab41bf-322f-42bf-8f7d-7b63ee092917', name: 'John Doe', username: 'johndoe', email: 'john.doe@example.com', password: 'Password@123' },
    ];
  
    jest.spyOn(service, 'findAll').mockResolvedValue(result);
  
    expect(await controller.findAll(paginationDto)).toBe(result);
    expect(service.findAll).toHaveBeenCalledWith(paginationDto);
  });

  it('Get user by ID', async () => {
    const userId = '85ab41bf-322f-42bf-8f7d-7b63ee092917';
    const result = { id: '85ab41bf-322f-42bf-8f7d-7b63ee092917', name: 'John Doe', username: 'johndoe', email: 'john.doe@example.com', password: 'Password@123' };
  
    jest.spyOn(service, 'findOne').mockResolvedValue(result);
  
    expect(await controller.findOne(userId)).toBe(result);
    expect(service.findOne).toHaveBeenCalledWith(userId);
  });

  it('Remove a user by ID', async () => {
    const userId = '85ab41bf-322f-42bf-8f7d-7b63ee092917';
    const result = undefined;
  
    jest.spyOn(service, 'remove').mockResolvedValue(result);
  
    expect(await controller.remove(userId)).toBe(result);
    expect(service.remove).toHaveBeenCalledWith(userId);
  });
  
  
  
});


