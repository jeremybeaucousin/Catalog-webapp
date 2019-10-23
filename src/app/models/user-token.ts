export enum UserRole {
    PUBLIC,
    ADMIN,
    USER
}

export class UserToken {
    username: string;
    role: UserRole;
}