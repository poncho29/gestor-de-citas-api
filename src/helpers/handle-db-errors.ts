import {
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

enum DBErrorCodes {
  DUPLICATE_KEY = '23505',
}

enum HTTPStatus {
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  CONFLICT = 409,
}

interface ErrorOptions {
  message?: string;
  field?: string;
  detail?: string;
}

export const handleDBErrors = (error: any, options: ErrorOptions = {}) => {
  const { message = '', field = 'valor', detail } = options;

  console.log(error);

  if (error.code === DBErrorCodes.DUPLICATE_KEY) {
    if (!message || !field) throw new BadRequestException(error.detail);
    else throw new BadRequestException(`Ya existe ${message} con ese ${field}`);
  }

  if (error.status === HTTPStatus.BAD_REQUEST) {
    throw new BadRequestException(error.message);
  }

  if (error.status === HTTPStatus.NOT_FOUND) {
    throw new NotFoundException(error.message);
  }

  if (error.status === HTTPStatus.CONFLICT) {
    throw new BadRequestException(error.message);
  }

  throw new InternalServerErrorException([
    'Error inesperado, verifique los registros del servidor',
    detail || error.detail,
  ]);
};
