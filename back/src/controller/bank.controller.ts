import { Controller, Post, Body } from '@nestjs/common';
import { BankDto } from 'src/dto/bank.dto';
import { BankService } from 'src/services/bank.service';

@Controller('api/bank')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Post()
  async addFundsFromBank(@Body() body: BankDto) {
    return await this.bankService.bankTransfer(body.bankEmail, body.amount);
  }
}
