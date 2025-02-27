import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindManyOptions, In, Repository } from 'typeorm';

import { AppointmentService } from './entities/appointment-service.entity';
import { Customer } from '../customers/entities/customer.entity';
import { Service } from '../services/entities/service.entity';
import { Appointment } from './entities/appointment.entity';
import { Reminder } from './entities/reminder.entity';
import { User } from '../users/entities/user.entity';

import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PaginationDto } from '../common/dtos';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Reminder)
    private readonly reminderRepository: Repository<Reminder>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(AppointmentService)
    private readonly appointmentServiceRepository: Repository<AppointmentService>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto, user: User) {
    const customer = await this.customerRepository.findOne({
      where: { id: createAppointmentDto.customer_id },
    });

    if (!customer) {
      throw new NotFoundException('Cliente no encontrado.');
    }

    const services = await this.serviceRepository.findBy({
      id: In(createAppointmentDto.service_ids),
    });

    // Verificar si todos los servicios fueron encontrados
    if (services.length !== createAppointmentDto.service_ids.length) {
      const foundIds = services.map((p) => p.id);
      const notFoundIds = createAppointmentDto.service_ids.filter(
        (id) => !foundIds.includes(id),
      );
      throw new NotFoundException(
        `Los siguientes servicios no fueron encontrados: ${notFoundIds.join(', ')}`,
      );
    }

    const appointment = this.appointmentRepository.create({
      date: new Date(createAppointmentDto.date),
      start_time: new Date(createAppointmentDto.start_time),
      end_time: new Date(
        new Date(createAppointmentDto.start_time).getTime() +
          services.reduce(
            (total, service) => total + Number(service.duration),
            0,
          ) *
            60000,
      ),
      customer,
      user,
      reminders: createAppointmentDto.reminders.map((reminder) =>
        this.reminderRepository.create({
          reminder_time: new Date(reminder.reminder_time),
        }),
      ),
      appointmentServices: services.map((service) =>
        this.appointmentServiceRepository.create({ service }),
      ),
    });

    const savedAppointment = await this.appointmentRepository.save(appointment);

    return savedAppointment;
  }

  async findAll(user: User, pagination: PaginationDto) {
    const { limit = 10, offset = 0 } = pagination;

    const findOptions: FindManyOptions<Appointment> = {
      take: limit,
      skip: offset,
      order: { id: 'ASC' },
      where: {
        user: { id: user.id },
        // enterprise: { id: user?.enterprise?.id },
      },
    };

    const [appointments, total] =
      await this.appointmentRepository.findAndCount(findOptions);

    return { appointments, total };
  }

  findOne(id: number) {
    return `This action returns a #${id} appointment`;
  }

  update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return `This action updates a #${id} appointment ${updateAppointmentDto}`;
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }

  private calculateEndTime(startTime: string, totalDuration: number): string {
    // Convertir startTime a minutos
    const [hours, minutes] = startTime.split(':').map(Number);
    const startTotalMinutes = hours * 60 + minutes;

    // Sumar la duración total de los servicios
    const endTotalMinutes = startTotalMinutes + totalDuration;

    // Convertir de nuevo a formato HH:MM
    const endHours = Math.floor(endTotalMinutes / 60) % 24;
    const endMinutes = endTotalMinutes % 60;
    return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
  }
}
