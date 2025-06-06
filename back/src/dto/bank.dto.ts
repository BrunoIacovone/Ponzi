import { IsNumber, Min, IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class BankDto {
  @IsNumber()
  @Min(1)
  amount: number;

  @IsEmail()
  @IsNotEmpty()
  bankEmail: string;
}
