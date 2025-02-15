export enum ValidRoles {
  SUPER_ADMIN = 'super-admin',
  ADMIN = 'admin',
  SUB_ADMIN = 'sub-admin',
  CLIENT = 'client',
}

export const ROLE_PERMISSIONS = {
  [ValidRoles.SUPER_ADMIN]: [
    ValidRoles.SUPER_ADMIN,
    ValidRoles.ADMIN,
    ValidRoles.SUB_ADMIN,
    ValidRoles.CLIENT,
  ],
  [ValidRoles.ADMIN]: [ValidRoles.ADMIN, ValidRoles.SUB_ADMIN],
};
