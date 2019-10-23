export enum UserRole {
    PUBLIC,
    ADMIN,
    USER
}

export class UserToken {
    userName: "";
    role: UserRole = UserRole.PUBLIC;
}