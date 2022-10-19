import * as bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { JwtPayload, verify } from 'jsonwebtoken';
import { configService } from '../config';

export const hashPassword = async (plainText: string): Promise<string> => {
    return bcrypt.hash(plainText, 10);
};

export const comparePassword = async (plainText: string, hashText: string): Promise<boolean> => {
    return bcrypt.compare(plainText, hashText);
};

export const signToken = (payload: any, exp: string): string => {
    return sign(payload, configService().jwt_secret, { expiresIn: exp });
};

export const getTokenPayLoad = (token: string, ignoreExpiration?: boolean): string | JwtPayload => {
    let payload: string | JwtPayload;
    try {
        payload = verify(String(token), configService().jwt_secret, { ignoreExpiration });
    } catch (error) {
        payload = { exp: 0, userId: null };
    }
    return payload;
};

export const hasTokenExpired = (exp: number): boolean => {
    const dateNow = new Date();
    if (exp * 1000 > dateNow.getTime()) {
        return false;
    } else {
        return true;
    }
};
