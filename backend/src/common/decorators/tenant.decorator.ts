import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator to extract tenant ID from request context
 */
export const TenantId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.tenantId || request.user?.tenantId;
  }
);

/**
 * Decorator to extract full tenant context from request
 */
export const TenantContext = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return (
      request.tenantContext || {
        tenantId: request.tenantId || request.user?.tenantId,
        organizationName: request.user?.organizationName,
      }
    );
  }
);
