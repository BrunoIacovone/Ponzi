import { IsNumber, Min, IsString, IsNotEmpty } from 'class-validator';

export class BankDto {
  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  @IsNotEmpty()
  bankEmail: string;
}
