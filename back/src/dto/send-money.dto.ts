import { IsString, IsNumber, Min } from 'class-validator';

export class SendMoneyDto {
  @IsString()
  recipientMail: string;

  @IsNumber()
  @Min(0)
  amount: number;
}
