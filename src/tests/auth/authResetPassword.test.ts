import * as bcrypt from 'bcrypt';
import { TestApp } from '../setup';
import * as Request from 'supertest';
import { UserEntity } from '../../entity/User.entity';
import { ResponseCode } from '../../enums/response.enums';
import { NotificationService } from '../../services/Notification.service';
import { signToken } from '../../utils/hash.utils';

describe('Authentication ResetPassword', () => {
    beforeAll(async () => {
        const email = 'test@gmail.com';
        const password = 'test';
        const hashPassword = await bcrypt.hash(password, 10);

        const user = UserEntity.create({
            email,
            password: hashPassword,
            name: 'John',
        });
        await user.save();
    });

    const sendEmail = jest.fn();
    NotificationService.prototype.sendEmail = sendEmail;

    it('wrong user email cannot reset', async () => {
        const response = await Request(TestApp.koaInstance.callback()).post('/auth/reset-password').send({ email: 'unknown@gmail.com' });

        expect(response.status).toEqual(ResponseCode.BAD_REQUEST);
        expect(response.text).toEqual('User with email not found');
        expect(sendEmail).toHaveBeenCalledTimes(0);
    });

    it('correct user email can reset', async () => {
        const response = await Request(TestApp.koaInstance.callback()).post('/auth/reset-password').send({ email: 'test@gmail.com' });

        expect(response.status).toEqual(ResponseCode.OK);
        expect(response.text).toEqual('Reset link has been sent');
        expect(sendEmail).toHaveBeenCalledTimes(1);
    });

    it('verify reset code with expired one', async () => {
        const token = signToken({}, '0s');
        await UserEntity.update({ email: 'test@gmail.com' }, { passwordResetCode: token });

        const response = await Request(TestApp.koaInstance.callback()).post('/auth/verify-password-code').send({ email: 'test@gmail.com', code: token });
        expect(response.status).toEqual(ResponseCode.BAD_REQUEST);
        expect(response.text).toEqual('Reset code is invalid or expired');
    });

    it('verify reset code with invalid code', async () => {
        const token = signToken({}, '2h');
        await UserEntity.update({ email: 'test@gmail.com' }, { passwordResetCode: token });

        const response = await Request(TestApp.koaInstance.callback()).post('/auth/verify-password-code').send({ email: 'test@gmail.com', code: undefined });
        expect(response.status).toEqual(ResponseCode.BAD_REQUEST);
        expect(response.text).toEqual('Reset code is invalid or expired');
    });

    it('verify reset code with valid code', async () => {
        const token = signToken({}, '2h');
        await UserEntity.update({ email: 'test@gmail.com' }, { passwordResetCode: token });

        const response = await Request(TestApp.koaInstance.callback()).post('/auth/verify-password-code').send({ email: 'test@gmail.com', code: token });
        expect(response.status).toEqual(ResponseCode.OK);
        expect(response.text).toEqual('Reset code is valid');
    });
});
