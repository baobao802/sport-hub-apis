import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AppUser } from '../types';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): AppUser => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
