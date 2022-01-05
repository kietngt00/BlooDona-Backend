import { VerifyCodeEntity } from './../entities/verify-code.entity';
import {
  AuthFailResponse,
  BaseResponse,
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
import { MailService } from 'src/modules/mail/services/mail.service';
import { VerifyDto } from '../dtos/verify.dto';
import { ResetPasswordDto } from '../dtos/reset-pass.dto';
import e from 'express';
import { ChangePasswordDto } from '../dtos/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(VerifyCodeEntity)
    private readonly verifyCodeRepository: Repository<VerifyCodeEntity>,

    private jwtService: JwtService,
    private mailService: MailService,
  ) { }

  async sendCodeSMS(phone: string) {
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    this.verifyCodeRepository.upsert(
      {
        phone,
        code: verifyCode,
      },
      ['phone'],
    );
    /** TODO: send SMS */
    return new SuccessResponse(verifyCode); // Return code for test, change latter
  }

  async register(payload: SignUpDto) {
    if (payload.password !== payload.confirmPassword)
      return new WrongInputResponse({
        password: payload.password,
        confirmPassword: payload.confirmPassword,
      });

    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(payload.password, salt);
    try {
      // insert new-user or update pending-user
      let record = await this.userRepository.findOne({
        phone: payload.phone,
      });
      if (record) {
        if (record?.status !== AccountStatus.PENDING)
          return new DuplicateResponse({ phone: payload.phone });
        record.password = hashedPassword;
        this.userRepository.save(record);
      } else {
        this.userRepository.insert({
          phone: payload.phone,
          password: hashedPassword,
        });
      }

      return this.sendCodeSMS(payload.phone);
    } catch (error) {
      console.log(error);
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
        const expiredTime = record.updated_at.getTime() + 5 * 60 * 1000;
        if (now > expiredTime)
          return new AuthFailResponse({ message: 'Expired' });
        this.userRepository.update({ phone }, { status: AccountStatus.ACTIVE });
        return new SuccessResponse({ message: 'Verified' });
      }
    } else {
      const now = +new Date();
      const resendTime = record.updated_at.getTime() + 1 * 60 * 1000;
      if (now < resendTime) return new AuthFailResponse({ message: 'Wait' });
      record.code = Math.floor(100000 + Math.random() * 900000).toString();
      this.verifyCodeRepository.save(record);
      /** TODO: send SMS */
      return new SuccessResponse({ verifyCode: record.code }); // Return code for test, change latter
    }
  }

  async sendCodeEmail(email: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.verifyCodeRepository.upsert(
      {
        email,
        code,
      },
      ['email'],
    );
    try {
      this.mailService.sendVerifyCode(email, code);
      return new SuccessResponse({ code }); // Return code for test, change latter
    } catch(error) {
      console.log(error);
      return new InternalErrorResponse();
    }
  }

  async registerEmail(userId: number, email: string) {
    try {
      await this.userRepository.update(
        { id: userId },
        {
          email,
          email_verified: false,
        },
      );

      return this.sendCodeEmail(email);
    } catch (error) {
      // console.log(error)
      if (error.code === 'ER_DUP_ENTRY')
        return new DuplicateResponse({ email });
      return new InternalErrorResponse();
    }
  }

  async verifyEmail(email: string, code: string, action: string) {
    const record = await this.verifyCodeRepository.findOne({
      email,
    });
    if (!record) return new NotFoundResponse();

    if (action === 'active') {
      if (code !== record.code) {
        return new AuthFailResponse({ message: 'Invalid' });
      } else {
        const now = +new Date();
        const expiredTime = record.updated_at.getTime() + 5 * 60 * 1000;
        if (now > expiredTime)
          return new AuthFailResponse({ message: 'Expired' });
        this.userRepository.update({ email }, { email_verified: true });
        return new SuccessResponse({ message: 'Verified' });
      }
    } else {
      const now = +new Date();
      const resendTime = record.updated_at.getTime() + 1 * 60 * 1000;
      if (now < resendTime) return new AuthFailResponse({ message: 'Wait' });
      record.code = Math.floor(100000 + Math.random() * 900000).toString();
      this.verifyCodeRepository.save(record);
      try {
        this.mailService.sendVerifyCode(email, record.code);
        return new SuccessResponse({ message: record.code }); // Return code for test, change latter
      } catch(error) {
        console.log(error);
        return new InternalErrorResponse();
      }
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

  isPhoneNumber(value: string) {
    return /^[0-9\-\+]{9,15}$/.test(value);
  }

  isEmail(value: string) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/.test(value);
  }
  
  async forgotPassword(identity: string) {
    if (identity != null) {
      const user = await this.userRepository.findOne({
        where: [{ phone: identity }, { email: identity }],
      });

      if (!user) return new AuthFailResponse({ message: 'Not Exist' });
      if (user.status === AccountStatus.BLOCK)
        return new AuthFailResponse({ message: 'Blocked' });

      if(this.isPhoneNumber(identity)) {
        return this.sendCodeSMS(identity);
      } else if(this.isEmail(identity)) {
        return this.sendCodeEmail(identity);
      }
    }

    return new WrongInputResponse({
      message: 'Please type at least your phone number or email',
    });
  }

  async updatePassword(user: UserEntity, password: string) {
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(password, salt);
    user.password = hashedPassword;
    this.userRepository.save(user);
    return new SuccessResponse();
  }

  async resetPassword(payload: ResetPasswordDto) {
    if (payload.password != payload.confirmPassword)
      return new WrongInputResponse({ message: 'Password and confirmPassword do not match' });

    if (payload.identity != null) {
      const record = await this.verifyCodeRepository.findOne({
        where: [{ phone: payload.identity }, { email: payload.identity }],
      });

      if (record) {
        if (record.code == payload.code) {
          const user = await this.userRepository.findOne({
            where: [{ phone: payload.identity }, { email: payload.identity }],
          });
          return await this.updatePassword(user, payload.password);
        }
      } else {
        return new NotFoundResponse({ message: payload.identity });
      }
    }

    return new WrongInputResponse('Please type at least your email or phone number and its respective code');
  }

  async changePassword(userId: number, payload: ChangePasswordDto) {
    if (payload.newPassword !== payload.confirmPassword)
      return new WrongInputResponse({ message: 'Password and confirmPassword do not match' });

    const user = await this.userRepository.findOne(userId);

    if (await bcrypt.compare(payload.oldPassword, user.password)) {
      return await this.updatePassword(user, payload.newPassword);
    } else {
      return new WrongInputResponse({ message: 'Current password does not match' });
    }
  }
}
