import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Decorator to specify required roles for accessing a route
 * @param roles - Array of roles required to access the endpoint
 */
export const Roles = (...roles: string[]): MethodDecorator =>
  SetMetadata(ROLES_KEY, roles);
