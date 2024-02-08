import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type CurrentConsumerInfo = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  careId: string;
  identityType: string;
  identityNumber: number;
  isProfileVerified?: boolean;
};

export const CurrentConsumer = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentConsumerInfo => {
    const request = ctx.switchToHttp().getRequest();
    const consumerInfo = request.headers['nest-consumer'];

    return JSON.parse(consumerInfo);
  },
);
