import { IsNumber, Min } from 'class-validator';

export class AddFundsDto {
  @IsNumber()
  @Min(0)
  amount: number;
}
