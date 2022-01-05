import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}
    
    async sendVerifyCode(email: string, verifyCode: string) {
        await this.mailerService.sendMail({
            to: email,
            subject: 'Verify Code',
            template: 'signup.hbs',
            context: {
                verifyCode
            }
        });
    }
}
