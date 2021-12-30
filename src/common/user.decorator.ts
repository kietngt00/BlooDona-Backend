import { UserEntity } from './../modules/user/entities/user.entity';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data, context: ExecutionContext): UserEntity => {
    const req = context.switchToHttp().getRequest();
    return req.user
  },
);
