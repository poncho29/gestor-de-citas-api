export type TUser = {
  name: string;
  email: string;
  phone: string;
  password: string;
  roles: string[];
};

export const users = [
  {
    name: 'Sebastian Meneses',
    email: 'semeneses@gmail.com',
    phone: '+573187395386',
    password: 'Sebas29',
    roles: ['super-admin'],
  },
  {
    name: 'Sergio Picon',
    email: 'spicon@gmail.com',
    phone: '+573187395386',
    password: 'Sebas29',
    roles: ['super-admin'],
  },
];
