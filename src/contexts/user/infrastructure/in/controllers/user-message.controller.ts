import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserPatterns } from '../../domain/messaging/user.patterns';
import { UserService } from '../../application/service/user.service';

interface GetUserRoleCommand {
  userId: string;
}

@Controller()
export class UserMessageController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(UserPatterns.GET_USER_ROLE)
  async getUserRole(@Payload() command: GetUserRoleCommand) {
    try {
      const user = await this.userService.getUserById(command.userId);
      if (!user) {
        return { role: null, error: 'User not found' };
      }
      return { role: user.role };
    } catch (error) {
      return { role: null, error: error.message };
    }
  }

  @MessagePattern(UserPatterns.GET_USER_BY_ID)
  async getUserById(@Payload() command: GetUserRoleCommand) {
    try {
      const user = await this.userService.getUserById(command.userId);
      if (!user) {
        return { user: null, error: 'User not found' };
      }
      return { user };
    } catch (error) {
      return { user: null, error: error.message };
    }
  }
}