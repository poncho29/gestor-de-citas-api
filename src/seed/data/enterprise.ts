export type TEnterprise = {
  name: string;
  email: string;
  phone: string;
  user: {
    name: string;
    email: string;
    password: string;
    phone: string;
    roles: string[];
  };
};

export const enterpises: TEnterprise[] = [
  {
    name: 'Empresa 1',
    email: 'empresa1@gmail.com',
    phone: '+15551456887',
    user: {
      name: 'Juan Perez',
      email: 'jperez@gmail.com',
      password: 'Jperez1+',
      phone: '+15551456887',
      roles: ['admin'],
    },
  },
  {
    name: 'Empresa 2',
    email: 'empresa2@gmail.com',
    phone: '+573205559062',
    user: {
      name: 'Luisa Ardila',
      email: 'lardila@gmail.com',
      password: 'Lardila2+',
      phone: '+573205559062',
      roles: ['admin'],
    },
  },
];
