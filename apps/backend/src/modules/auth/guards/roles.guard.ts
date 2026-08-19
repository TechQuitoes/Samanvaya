import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../../user/schemas/user.schema';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) {
      throw new ForbiddenException('Access denied: No role assigned to user');
    }

    // Super Admin has unrestricted access across all routes
    if (
      user.role === UserRole.SUPER_ADMIN ||
      user.role === 'Super Administrator' ||
      user.role === 'Super Admin'
    ) {
      return true;
    }

    const normalizedRole =
      user.role === 'Administrator' ? UserRole.ADMIN : user.role === 'Super Administrator' ? UserRole.SUPER_ADMIN : user.role;

    const hasRole =
      requiredRoles.includes(user.role as UserRole) ||
      requiredRoles.includes(normalizedRole as UserRole);
    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied: Required role (${requiredRoles.join(', ')}) matching criteria not met for user with role "${user.role}"`,
      );
    }

    return true;
  }
}
