import { IsString, IsNumber, Min } from 'class-validator';

export class SendMoneyDto {
  @IsString()
  recipientId: string;

  @IsNumber()
  @Min(1)
  amount: number;
}
