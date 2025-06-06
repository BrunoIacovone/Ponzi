import { IsNumber, Min, IsEmail, IsNotEmpty } from 'class-validator';

export class DebinDto {
  @IsNumber()
  @Min(1)
  amount: number;

  @IsEmail()
  @IsNotEmpty()
  bankEmail: string;
}
