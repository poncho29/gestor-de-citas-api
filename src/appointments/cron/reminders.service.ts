import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { Repository } from 'typeorm';
import axios from 'axios';

import { Reminder } from '../entities/reminder.entity';

@Injectable()
export class RemindersService {
  private readonly logger = new Logger(RemindersService.name);

  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(Reminder)
    private readonly reminderRepository: Repository<Reminder>,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleReminders() {
    this.logger.debug('Verificando recordatorios pendientes...');

    const now = new Date();

    // this.logger.debug(`Hora actual (UTC): ${now.toISOString()}`);

    const reminders = await this.reminderRepository.find({
      where: {
        is_sent: false, // Solo recordatorios no enviados
      },
      relations: [
        'appointment',
        'appointment.customer',
        'appointment.customer.enterprise',
      ],
      select: {
        id: true,
        reminder_time: true,
        is_sent: true,
        appointment: {
          id: true,
          date: true,
          start_time: true,
          customer: {
            id: true,
            phone: true,
            enterprise: {
              id: true,
              phone: true,
            },
          },
        },
      },
    });

    const validReminders = reminders.filter((reminder) => {
      return reminder.reminder_time.toISOString() <= now.toISOString();
    });

    this.logger.debug(`Recordatorios encontrados: ${validReminders.length}`);

    for (const reminder of validReminders) {
      try {
        await this.sendReminder(reminder);

        reminder.is_sent = true;
        await this.reminderRepository.save(reminder);

        this.logger.log(`Recordatorio enviado: ${reminder.id}`);
      } catch (error) {
        this.logger.error(
          `Error al enviar el recordatorio ${reminder.id}:`,
          error,
        );
      }
    }
  }

  private async sendReminder(reminder: Reminder) {
    const WHATSAPP_API_TOKEN =
      this.configService.get<string>('WHATSAPP_API_TOKEN');
    const WHATSAPP_PHONE_NUMBER_ID =
      reminder.appointment.customer.enterprise.phone;

    const customerPhone = reminder.appointment.customer.phone; // Número del cliente

    // Configurar el mensaje de plantilla para WhatsApp
    const data = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: `+${customerPhone}`, // Número del cliente
      type: 'template',
      template: {
        name: 'event_details_reminder_2',
        language: {
          code: 'es',
        },
        components: [
          {
            type: 'body',
            parameters: [
              {
                type: 'text',
                text: reminder.appointment.date.toLocaleString(),
              },
              {
                type: 'text',
                text: `${String(reminder.appointment.start_time.getHours()).padStart(2, '0')}:${String(reminder.appointment.start_time.getMinutes()).padStart(2, '0')}`, // Hora formateada ({{hora}})
              },
              {
                type: 'text',
                text: 'corte de pelo',
              },
            ],
          },
        ],
      },
    };

    try {
      const response = await axios.post(
        `https://graph.facebook.com/v21.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
        data,
        {
          headers: {
            Authorization: `Bearer ${WHATSAPP_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        },
      );

      this.logger.debug(`Mensaje enviado a ${customerPhone}:`, response.data);
    } catch (error) {
      this.logger.error(
        `Error al enviar mensaje a ${customerPhone}:`,
        error.response?.data || error.message,
      );
      throw error;
    }
  }
}
