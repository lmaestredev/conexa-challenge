// import { UserController } from "src/user/user.controller";
// import { UserService } from "src/user/user.service";
// import { Test } from '@nestjs/testing';


// describe('UserController', () => {
//   let userController: UserController;
//   let userService: UserService;

//   beforeEach(async () => {
//     const moduleRef = await Test.createTestingModule({
//         controllers: [UserController],
//         providers: [UserService],
//       }).compile();

//     userService = moduleRef.get(UserService);
//     userController = moduleRef.get(UserController);
//   });

//   describe('findAll', () => {
//     it('should return an array of cats', async () => {
//       const result = ['test'];
//       jest.spyOn(userService, 'findAll').mockImplementation(() => result);

//       expect(await userController.findAll()).toBe(result);
//     });
//   });
// });

