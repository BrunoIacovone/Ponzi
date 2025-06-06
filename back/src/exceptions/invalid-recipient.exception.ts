import { BadRequestException } from '@nestjs/common';

export class InvalidRecipientException extends BadRequestException {
  constructor(email: string) {
    super(`Recipient mail is invalid: ${email}`, 'INVALID_RECIPIENT');
  }
}
