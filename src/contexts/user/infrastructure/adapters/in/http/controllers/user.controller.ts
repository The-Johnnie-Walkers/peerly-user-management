import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import type { Request } from 'express';
import { memoryStorage } from 'multer';
import { UserRepository } from '../../../out/persistence/repositories/user/user.repository';
import { UserResponseDTO } from '../dto/response/user-response.dto';
import { UserRequestDTO } from '../dto/request/user-request.dto';
import { UserService } from '../../../../../application/service/user.service';
import { UserDtoMapper } from '../mapper/user-dto.mapper';
import { AvatarStorageService, type AvatarUploadFile } from '../../../out/storage/avatar-storage.service';
import { DiscoverUsersUseCaseImpl } from '../../../../../application/use-cases/user/discover-users-use-case.impl';
import { ConnectionMessagingClientService } from '../../../out/messaging/connection-messaging-client.service';

@Controller('/users')
export class UserController {
  constructor(
    private userService: UserService,
    private userDtoMapper: UserDtoMapper,
    private userRepository: UserRepository,
    private avatarStorage: AvatarStorageService,
    private discoverUsersUseCase: DiscoverUsersUseCaseImpl,
    private connectionClient: ConnectionMessagingClientService,
  ) {}

  @Post('')
  async createUser(@Body() userRequest: UserRequestDTO): Promise<UserResponseDTO> {
    const user = this.userDtoMapper.toDomain(userRequest);
    const createUser = await this.userService.createUser(user);
    return this.userDtoMapper.toResponse(createUser);
  }

  @Put('/:id')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async updateUser(
    @Param('id') id: string,
    @Req() req: Request,
    @UploadedFile() avatar: AvatarUploadFile | undefined,
    @Body() body: Record<string, unknown>,
  ): Promise<UserResponseDTO> {
    const contentType = req.headers['content-type'] ?? '';
    const isMultipart = contentType.includes('multipart/form-data');

    let userRequest: UserRequestDTO;

    if (isMultipart) {
      const dataField = body.data;
      if (typeof dataField !== 'string') {
        throw new BadRequestException('El campo "data" es obligatorio en peticiones multipart.');
      }
      userRequest = await this.parseUserRequestJson(dataField);
      if (avatar) {
        userRequest.profilePicURL = await this.avatarStorage.save(id, avatar);
      }
    } else {
      userRequest = await this.validateUserRequest(body as unknown as UserRequestDTO);
    }

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

  @Get('/:id/discover')
  async discoverUsers(@Param('id') id: string): Promise<UserResponseDTO[]> {
    const users = await this.userService.discoverUsers(id);
    return this.userDtoMapper.toResponseList(users);
  }

  @Get('/:id/compatibility/:otherId')
  async getCompatibility(
    @Param('id') userId: string,
    @Param('otherId') otherId: string,
  ): Promise<{ score: number }> {
    const [me, other] = await Promise.all([
      this.userRepository.findById(userId),
      this.userRepository.findById(otherId),
    ]);

    if (!me || !other) return { score: 0 };

    const connectionsResponse = await this.connectionClient.getAllConnections();
    const allConnections: Array<{ requesterId: string; receiverId: string; status: string }> =
      connectionsResponse.connections ?? [];

    const myFriendIds = new Set<string>(
      allConnections
        .filter(c => c.status === 'ACCEPTED' && (c.requesterId === userId || c.receiverId === userId))
        .map(c => c.requesterId === userId ? c.receiverId : c.requesterId),
    );

    const score = this.discoverUsersUseCase.calculateCompatibility(me, other, myFriendIds, allConnections);
    return { score };
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

  @Patch('/:id/presence')
  async updatePresence(
    @Param('id') id: string,
    @Body() body: { isOnline: boolean },
  ): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException(`User ${id} not found`);
    user.isOnline = body.isOnline;
    user.lastTimeConnected = new Date();
    await this.userService.updateUser(id, user);
  }

  private async parseUserRequestJson(dataJson: string): Promise<UserRequestDTO> {
    let raw: Record<string, unknown>;
    try {
      raw = JSON.parse(dataJson) as Record<string, unknown>;
    } catch {
      throw new BadRequestException('El campo "data" no contiene JSON válido.');
    }
    return this.validateUserRequest(raw as unknown as UserRequestDTO);
  }

  private async validateUserRequest(payload: UserRequestDTO): Promise<UserRequestDTO> {
    const normalized: UserRequestDTO = {
      ...payload,
      interests: this.normalizeInterests(payload.interests) as UserRequestDTO['interests'],
    };

    const dto = plainToInstance(UserRequestDTO, normalized);
    dto.interests = normalized.interests;

    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return dto;
  }

  private normalizeInterests(interests: unknown): Array<{ id: string }> {
    if (!Array.isArray(interests)) return [];

    return interests
      .filter((item) => item != null && item !== '')
      .map((item) => {
        if (typeof item === 'string') return { id: item };
        const raw = item as { id?: string };
        return { id: raw?.id ?? '' };
      })
      .filter((item) => item.id.length > 0);
  }
}
