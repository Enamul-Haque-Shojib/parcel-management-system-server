export const AuthRole = {
  Admin: 'Admin',
  DeliverMan: 'DeliverMan',
  User: 'User',
} as const;


export const authSearchableField = [
  'authId',
  'name',
  'email',
  'authPhoneNumber',
  'role',
];
