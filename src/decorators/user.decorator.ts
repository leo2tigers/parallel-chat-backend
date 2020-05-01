import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const LoadUser = createParamDecorator((data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
});
