import { UserEntity } from './../../user/entities/user.entity';
import { VerifyDto } from './../dtos/verify.dto';
import { LoginDto } from './../dtos/login.dto';
import { SignUpDto, RegisterEmailDto } from './../dtos/sign-up.dto';
import { AuthService } from '../services/auth.service';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/user.decorator';
import { ResetPasswordDto } from '../dtos/reset-pass.dto';
import { ChangePasswordDto } from '../dtos/change-password.dto';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  /** Normal user need to register via phone */
  @Post('sign-up')
  async register(@Body() payload: SignUpDto) {
    return await this.authService.register(payload);
  }

  @Post('verify/phone')
  async verifyPhone(@Body() payload: VerifyDto) {
    return await this.authService.verifyPhone(
      payload.phone,
      payload.code,
      payload.action,
    );
  }

  /** normal user can register email after create account with phone */
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @Post('register/email')
  async registerEmail(
    @CurrentUser() user: UserEntity,
    @Body() payload: RegisterEmailDto,
  ) {
    return await this.authService.registerEmail(user.id, payload.email);
  }

  @Post('verify/email')
  async verifyEmail(@Body() payload: VerifyDto) {
    return await this.authService.verifyEmail(
      payload.email,
      payload.code,
      payload.action,
    );
  }

  @Post('login')
  async login(@Body() payload: LoginDto) {
    return await this.authService.login(payload.identity, payload.password);
  }

  /** Send sms/email verification code */
  @Post('password/forgot')
  async forgotPassword(@Body() payload: ResetPasswordDto) {
    return await this.authService.forgotPassword(payload.identity);
  }

  /** Verify code from client
   *  Change password
   */
  @Post('password/reset')
  async resetPassword(@Body() payload: ResetPasswordDto) {
    return await this.authService.resetPassword(payload);
  }

  /** User change password
   *  @Body: oldPassword, newPassword, confirmPassword
   */
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @Post('password/change')
  async changePassword(
    @CurrentUser() user: UserEntity,
    @Body() payload: ChangePasswordDto
  ) { 
    return await this.authService.changePassword(user.id, payload);
  }
}
