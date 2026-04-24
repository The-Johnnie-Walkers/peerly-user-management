import { Controller, Post, Put, Delete, Get, Param, Body, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../../out/persistence/repositories/user/user.repository';
import { UserResponseDTO } from '../dto/response/user-response.dto';
import { UserRequestDTO } from '../dto/request/user-request.dto';
import { UserService } from '../../../../../application/service/user.service';
import { UserDtoMapper } from '../mapper/user-dto.mapper';

@Controller('/users')
export class UserController {
  constructor(
    private userService: UserService,
    private userDtoMapper: UserDtoMapper,
    private userRepository: UserRepository,
  ) { }

  @Post('')
  async createUser(@Body() userRequest: UserRequestDTO): Promise<UserResponseDTO> {
    const user = this.userDtoMapper.toDomain(userRequest);
    const createUser = await this.userService.createUser(user);
    return this.userDtoMapper.toResponse(createUser);
  }

  @Put('/:id')
  async updateUser(@Param('id') id: string, @Body() userRequest: UserRequestDTO): Promise<UserResponseDTO> {
    const user = this.userDtoMapper.toDomain(userRequest);
    const userUpdated = await this.userService.updateUser(id, user);
    return this.userDtoMapper.toResponse(userUpdated);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    await this.userService.deleteUserById(id);
    return Promise.resolve();
  }

  @Get('/by-email/:email')
  async getUserByEmail(@Param('email') email: string): Promise<UserResponseDTO> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return this.userDtoMapper.toResponse(user);
  }

  @Get('/:id')
  async getUserById(@Param('id') id: string): Promise<UserResponseDTO> {
    const user = await this.userService.getUserById(id);
    return this.userDtoMapper.toResponse(user);
  }

  @Get('')
  async getAllUsers(): Promise<UserResponseDTO[]> {
    const users = await this.userService.getAllUsers();
    return this.userDtoMapper.toResponseList(users);
  }
}
