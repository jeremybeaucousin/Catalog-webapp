import { version } from '../../package.json';

export const environment = {
  production: true,
  appVersion: version,
  catalogApiEndploint: "https://109.18.10.254:9001/",
  authenticationApiEndpoint: "https://109.18.10.254:9001/",
  authenticationApiCookieKey: "PLAY_SESSION",
  roles: {
    appAdminRoles: ["superuser", "users_admin"],
    toolboxesAdminRoles: ["superuser", "catalog_admin"],
    toolboxesUserRoles: ["catalog_user"],
  }
};
