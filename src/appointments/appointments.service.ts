import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { In, Repository } from 'typeorm';

import { AppointmentService } from './entities/appointment-service.entity';
import { Customer } from '../customers/entities/customer.entity';
import { Service } from '../services/entities/service.entity';
import { Appointment } from './entities/appointment.entity';
import { Reminder } from './entities/reminder.entity';

import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

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

  async create(createAppointmentDto: CreateAppointmentDto) {
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

    // Convertir las cadenas ISO a objetos Date
    const date = new Date(createAppointmentDto.date);
    const startTime = new Date(createAppointmentDto.start_time);

    const totalDuration = services.reduce(
      (total, service) => total + Number(service.duration),
      0,
    );
    const endTime = new Date(startTime.getTime() + totalDuration * 60000);
    console.log({
      endTime,
      totalDuration,
    });

    const appointment = this.appointmentRepository.create({
      date,
      start_time: startTime,
      end_time: endTime,
      customer,
      reminders: createAppointmentDto.reminders.map((reminder) =>
        this.reminderRepository.create(reminder),
      ),
      appointmentServices: services.map((service) =>
        this.appointmentServiceRepository.create({ service }),
      ),
    });

    console.log({
      date,
      start_time: startTime,
      end_time: endTime,
      customer,
      reminders: createAppointmentDto.reminders.map((reminder) =>
        this.reminderRepository.create(reminder),
      ),
      appointmentServices: services.map((service) =>
        this.appointmentServiceRepository.create({ service }),
      ),
    });

    const savedAppointment = await this.appointmentRepository.save(appointment);

    return savedAppointment;
  }

  findAll() {
    return `This action returns all appointments`;
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
