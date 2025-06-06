import { IsString, IsNumber, Min, IsEmail, IsNotEmpty } from 'class-validator';

export class SendMoneyDto {
  @IsEmail()
  @IsNotEmpty()
  recipientMail: string;

  @IsNumber()
  @Min(1)
  amount: number;
}
