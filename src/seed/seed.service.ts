import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { DataSource, Repository } from 'typeorm';

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

    console.log('Dropping database...');

    await this.dataSource.dropDatabase();
    await this.dataSource.synchronize();

    console.log('Running seed...');

    await this.insertEnterprises();
    await this.insertUsers();
    await this.insertCustomers();
    // await this.insertServices();

    return 'Seed ejecutado correctamente';
  }

  async insertEnterprises(): Promise<void> {
    enterpises.forEach(async (enterprise) => {
      const admin = this.userRepository.create(enterprise.user);
      await this.userRepository.save(admin);

      const newEnterprise = this.enterpriseRepository.create({
        ...enterprise,
        users: [admin],
      });
      await this.enterpriseRepository.save(newEnterprise);
    });
  }

  async insertUsers(): Promise<void> {
    users.forEach(async (user) => {
      const newUser = this.userRepository.create(user);
      await this.userRepository.save(newUser);
    });
  }

  async insertCustomers(): Promise<void> {
    const enterprise = await this.enterpriseRepository.findOneBy({
      email: 'empresa1@gmail.com',
    });

    console.log('customers', enterprise);

    customers.forEach(async (customer) => {
      const newCustomer = this.customerRepository.create({
        ...customer,
        user_id: enterprise.users[0].id,
        // enterprise,
      });
      await this.customerRepository.save(newCustomer);
    });
  }

  async insertServices(): Promise<void> {
    const newServices: Service[] = [];

    const enterprise = await this.enterpriseRepository.findOne({
      where: { email: 'empresa1@gmail.com' },
    });

    services.forEach(async (service) => {
      const newService = this.serviceRepository.create({
        ...service,
        user_id: enterprise.users[0].id,
        enterprise,
      });
      await this.serviceRepository.save(newService);
      newServices.push(newService);
    });
  }
}
