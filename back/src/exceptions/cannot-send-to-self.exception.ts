import { BadRequestException } from '@nestjs/common';

export class CannotSendToSelfException extends BadRequestException {
  constructor() {
    super('Cannot send money to yourself', 'CANNOT_SEND_TO_SELF');
  }
}
