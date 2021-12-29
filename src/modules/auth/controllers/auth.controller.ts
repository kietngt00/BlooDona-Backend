import { SignUpDto } from './../dtos/sign-up.dto';
import { AuthService } from '../services/auth.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor( private readonly authService: AuthService) {}

  @Post('sign-up')
  async register(@Body() payload: SignUpDto) {
    return this.authService.register(payload)
  }

}
