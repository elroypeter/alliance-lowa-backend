export interface IUser {
    id: number;
    email: string;
    name: string;
    password: string;
    passwordResetCode: string;
}

export interface IUserDto {
    email: string;
    name: string;
    password: string;
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type IPublicUser = keyof Omit<IUser, 'password' | 'passwordResetCode'>;
