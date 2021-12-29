import { VerifyCodeEntity } from './../entities/verify-code.entity';
import {
  DuplicateResponse,
  InternalErrorResponse,
  SuccessResponse,
  WrongInputResponse,
} from './../../../common/response.factory';
import { SignUpDto } from './../dtos/sign-up.dto';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Error } from 'src/constants/error.constant';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(VerifyCodeEntity)
    private readonly verifyCodeRepository: Repository<VerifyCodeEntity>,
  ) {}

  async register(payload: SignUpDto) {
    if (payload.password !== payload.confirmPassword)
      return new WrongInputResponse({
        password: payload.password,
        confirmPassword: payload.confirmPassword,
      });

    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(payload.password, salt);
    try {
      const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
      /** TODO: change insert to upsert */
      await this.userRepository.insert({
        phone: payload.phone,
        password: hashedPassword,
      });
      this.verifyCodeRepository.insert({
        phone: payload.phone,
        code: verifyCode,
      });
      /** TODO: send SMS */

      return new SuccessResponse({ verifyCode });
    } catch (error) {
      // console.log(error);
      if (error.code === Error.DUPLICATE)
        return new DuplicateResponse({ phone: payload.phone });
      return new InternalErrorResponse(payload);
    }
  }
}
