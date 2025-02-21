import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Enterprise } from '../enterprise/entities/enterprise.entity';
import { Customer } from '../customers/entities/customer.entity';
import { Service } from '../services/entities/service.entity';
import { User } from '../users/entities/user.entity';

import { enterpises } from './data/enterprise';
import { customers } from './data/customer';
import { services } from './data/service';
import { users } from './data/user';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly configService: ConfigService,
    private dataSource: DataSource,

    @InjectRepository(Enterprise)
    private readonly enterpriseRepository: Repository<Enterprise>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    const env = this.configService.get<string>('NODE_ENV');

    if (env === 'production') {
      this.logger.error(
        'Seed execution is not allowed in production environment',
      );
      throw new BadRequestException(
        'Seed execution is not allowed in production environment',
      );
    }

    await this.dataSource.dropDatabase();
    await this.dataSource.synchronize();

    await this.insertEnterprises();
    await this.insertUsers();
    await this.insertCustomers();
    await this.insertServices();

    return 'Seed ejecutado correctamente';
  }

  async insertEnterprises(): Promise<void> {
    const enterprisePromises = enterpises.map(async (enterprise) => {
      const { user, ...restEnterprise } = enterprise;
      const { password, ...restUser } = user;

      const admin = this.userRepository.create({
        ...restUser,
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(admin);

      const newEnterprise = this.enterpriseRepository.create({
        ...restEnterprise,
        users: [admin],
      });

      await this.enterpriseRepository.save(newEnterprise);
    });

    await Promise.all(enterprisePromises);
  }

  async insertUsers(): Promise<void> {
    const userPromises = users.map(async (user) => {
      const { password, ...restUser } = user;
      const newUser = this.userRepository.create({
        ...restUser,
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(newUser);
    });

    await Promise.all(userPromises);
  }

  async insertCustomers(): Promise<void> {
    const customerPromises = customers.map(async (customer) => {
      // Busca la empresa asociada al cliente
      const enterprise = await this.enterpriseRepository.findOne({
        where: { email: customer.enterpriseEmail },
        relations: ['users'],
      });

      if (!enterprise) {
        throw new Error(
          `Empresa no encontrada para el cliente: ${customer.name}`,
        );
      }

      // Crea el cliente y lo asocia con su empres y usuario
      const newCustomer = this.customerRepository.create({
        ...customer,
        user_id: enterprise.users[0].id,
        enterprise,
      });

      await this.customerRepository.save(newCustomer);
    });

    await Promise.all(customerPromises);
  }

  async insertServices(): Promise<void> {
    const enterprises = await this.enterpriseRepository.find({
      relations: ['users'],
    });

    const servicePromises = enterprises.flatMap((enterprise) => {
      return services.map(async (service) => {
        const newService = this.serviceRepository.create({
          ...service,
          user_id: enterprise.users[0].id,
          enterprise,
        });

        await this.serviceRepository.save(newService);
      });
    });

    await Promise.all(servicePromises);
  }
}
