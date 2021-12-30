import { VerifyCodeEntity } from './../entities/verify-code.entity';
import {
  AuthFailResponse,
  DuplicateResponse,
  InternalErrorResponse,
  NotFoundResponse,
  SuccessResponse,
  WrongInputResponse,
} from './../../../common/response.factory';
import { SignUpDto } from './../dtos/sign-up.dto';
import {
  AccountStatus,
  UserEntity,
} from 'src/modules/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Error } from 'src/constants/error.constant';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(VerifyCodeEntity)
    private readonly verifyCodeRepository: Repository<VerifyCodeEntity>,

    private jwtService: JwtService,
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
      console.log(error);
      if (error.code === Error.DUPLICATE)
        return new DuplicateResponse({ phone: payload.phone });
      return new InternalErrorResponse(payload);
    }
  }

  async verifyPhone(phone: string, code: string, action: string) {
    const record = await this.verifyCodeRepository.findOne({
      phone,
    });
    if (!record) return new NotFoundResponse();

    if (action === 'active') {
      if (code !== record.code) {
        return new AuthFailResponse({ message: 'Invalid' });
      } else {
        const now = +new Date();
        const expiredTime = record.updated_at.getTime() + 0 * 60 * 1000;
        if (now > expiredTime)
          return new AuthFailResponse({ message: 'Expired' });
        this.userRepository.update(
          { phone },
          { status: AccountStatus.ACTIVE }
        );
        return new SuccessResponse({ message: 'Verified' });
      }
    } else {
      const now = +new Date();
      const resendTime = record.updated_at.getTime() + 1 * 60 * 1000;
      if (now < resendTime) return new AuthFailResponse({ message: 'Wait' });
      record.code = Math.floor(100000 + Math.random() * 900000).toString();
      this.verifyCodeRepository.save(record);
      /** TODO: send SMS */
      return new SuccessResponse({ verifyCode: record.code });
    }
  }

  async login(identity: string, password: string) {
    const user = await this.userRepository.findOne({
      where: [{ phone: identity }, { email: identity }],
    });

    if (!user) return new AuthFailResponse({ message: 'Not Exist' });
    if (user.status === AccountStatus.BLOCK)
      return new AuthFailResponse({ message: 'Blocked' });

    if (await bcrypt.compare(password, user.password)) {
      const { id, phone, email, role } = user;
      const accessToken: string = await this.jwtService.sign({
        id,
        phone,
        email,
        role,
      });
      return new SuccessResponse({ accessToken });
    }
    return new AuthFailResponse({ message: 'Wrong password' });
  }
}
