import { UserEntity } from './../entities/user.entity';
import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/user.decorator';
@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
@UseGuards(AuthGuard())
export class UserController {
  @Post('')
  helloUser(@CurrentUser()user: UserEntity): string {
    return `Hello User ${user.id}`;
  }
}
