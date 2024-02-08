import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AnonymousKeyMetadata } from '../decorator';

export const IsAnonymousEndpoint = (
  context: ExecutionContext,
  reflector: Reflector,
): boolean => {
  const result: boolean | undefined = reflector.get<boolean>(
    AnonymousKeyMetadata,
    context.getHandler(),
  );
  return result || false;
};
