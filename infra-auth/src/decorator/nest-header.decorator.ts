import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { NestRole } from './roles.decorator';
import { UnauthorizedException } from '@xpia/infra-exception';

export type CareHeadersInfo = {
  careId: string;
  careRoles: NestRole[];
};

export const NestHeaders = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CareHeadersInfo => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.headers['care-id']) {
      throw new UnauthorizedException('Please provide nest id');
    }

    const careId = request.headers['care-id'];
    const careRoles = (request.headers['role'] || '')
      .split(',')
      .map((roleS: string) => NestRole[roleS as keyof typeof NestRole]);

    return { careId, careRoles };
  },
);
