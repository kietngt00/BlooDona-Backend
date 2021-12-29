import { Controller, Post } from '@nestjs/common';

@Controller('user')
export class UserController {
  @Post('')
  helloUser() : string {
    return "Hello Word";
  }
}
