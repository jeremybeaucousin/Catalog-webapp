import { version } from '../../package.json';

export const environment = {
  production: true,
  appVersion: version,
  catalogApiEndploint: "https://109.18.10.254:9001/",
  authenticationApiEndpoint: "https://109.18.10.254:9001/",
  adminRoles: ["superuser", "catalog_admin"],
  userRoles: ["catalog_user"],
};
