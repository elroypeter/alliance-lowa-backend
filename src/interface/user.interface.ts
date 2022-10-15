
export interface User{
    id: number;
    email: string;
    name: string;
    password: string;
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type PublicUser = keyof Omit<User, 'password'>;