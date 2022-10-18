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

    it('user resets password with wrong email', async () => {
        const token = signToken({}, '2h');
        await UserEntity.update({ email: 'test@gmail.com' }, { passwordResetCode: token });

        const response = await Request(TestApp.koaInstance.callback()).post('/auth/change-password').send({
            email: 'unknown@gmail.com',
            code: token,
            newPassword: 'newtest',
        });

        expect(response.status).toEqual(ResponseCode.BAD_REQUEST);
        expect(response.text).toEqual('User with email or reset code is not found');
    });

    it('user resets password with wrong code', async () => {
        const token = signToken({}, '2h');
        await UserEntity.update({ email: 'test@gmail.com' }, { passwordResetCode: token });

        const response = await Request(TestApp.koaInstance.callback()).post('/auth/change-password').send({
            email: 'test@gmail.com',
            code: 'wrong code',
            newPassword: 'newtest',
        });

        expect(response.status).toEqual(ResponseCode.BAD_REQUEST);
        expect(response.text).toEqual('User with email or reset code is not found');
    });

    it('user resets password with successfully', async () => {
        const token = signToken({}, '2h');
        await UserEntity.update({ email: 'test@gmail.com' }, { passwordResetCode: token });

        const response = await Request(TestApp.koaInstance.callback()).post('/auth/change-password').send({
            email: 'test@gmail.com',
            code: token,
            newPassword: 'newtest',
        });

        expect(response.status).toEqual(ResponseCode.OK);
        expect(response.text).toEqual('Password has been updated');

        // can login with new password
        const successLoginResponse = await Request(TestApp.koaInstance.callback()).post('/auth/login').send({ email: 'test@gmail.com', password: 'newtest' });
        expect(successLoginResponse.status).toEqual(ResponseCode.OK);

        // cannot login with old password
        const failureLoginResponse = await Request(TestApp.koaInstance.callback()).post('/auth/login').send({ email: 'test@gmail.com', password: 'test' });
        expect(failureLoginResponse.status).toEqual(ResponseCode.UNAUTHORIZED);
        expect(failureLoginResponse.text).toEqual('Invalid user password');
    });
});
