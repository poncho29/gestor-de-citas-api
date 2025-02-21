export type TCustomer = {
  name: string;
  email: string;
  phone: string;
  enterpriseEmail: string;
};

export const customers = [
  {
    name: 'Laura Martinez',
    email: 'lmartinez@gmail.com',
    phone: '+573042119022',
    enterpriseEmail: 'empresa1@gmail.com', // Asociado a la empresa 1
  },
  {
    name: 'Jesus Meneses',
    email: 'jmeneses@gmail.com',
    phone: '+573188879062',
    enterpriseEmail: 'empresa1@gmail.com', // Asociado a la empresa 1
  },
  {
    name: 'Karla Villar',
    email: 'kvillar@gmail.com',
    phone: '+573105554024',
    enterpriseEmail: 'empresa2@gmail.com', // Asociado a la empresa 2
  },
  {
    name: 'Luis Perez',
    email: 'lperez@gmail.com',
    phone: '+573162223456',
    enterpriseEmail: 'empresa2@gmail.com', // Asociado a la empresa 2
  },
];
