import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { UserRole } from 'src/modules/user/entities/user.entity';
@Injectable()
export class AdminGuard implements CanActivate{
    canActivate(context:ExecutionContext):boolean{
        const req = context.switchToHttp().getRequest();
        const { role } = req.user;
        if (role === UserRole.ADMIN) return true
        return false;
    }
}