import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (_data: unknown, _ctx: ExecutionContext): string => {
    // Placeholder: hardcoded dev user until Better Auth is integrated
    return 'dev-user';
  },
);
