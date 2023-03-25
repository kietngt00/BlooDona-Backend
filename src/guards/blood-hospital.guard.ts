import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { UserRole } from 'src/modules/user/entities/user.entity';
@Injectable()
export class BloodHospitalGuard implements CanActivate{
    canActivate(context:ExecutionContext):boolean{
        const req = context.switchToHttp().getRequest();
        const { role } = req.user;
        if (role === UserRole.BLOOD_HOSPITAL) return true
        return false;
    }
}