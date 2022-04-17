import { SetMetadata } from '@nestjs/common';

export const ROLLES_KEY = 'roles'
export const Roles = (...roles: string[]) => SetMetadata(ROLLES_KEY, roles);
