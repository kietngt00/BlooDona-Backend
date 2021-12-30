import { VerifyDto } from './../dtos/verify.dto';
import { LoginDto } from './../dtos/login.dto';
import { SignUpDto } from './../dtos/sign-up.dto';
import { AuthService } from '../services/auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor( private readonly authService: AuthService) {}

  @Post('sign-up')
  async register(@Body() payload: SignUpDto) {
    return await this.authService.register(payload)
  }

  @Post('verify/phone')
  async verifyPhone(@Body() payload: VerifyDto) {
    return await this.authService.verifyPhone(payload.phone, payload.code, payload.action)
  }

  @Post('login')
  async login(@Body() payload: LoginDto){
    return await this.authService.login(payload.identity, payload.password)
  }
}
