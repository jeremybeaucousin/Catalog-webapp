export enum UserRole {
    PUBLIC,
    APP_ADMIN,
    CATALOG_ADMIN,
    CATALOG_USER
}

export class UserToken {
    username: string;
    roles: Array<UserRole>;
}