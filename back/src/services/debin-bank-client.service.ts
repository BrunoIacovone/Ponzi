import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DebinBankClientService {
  private readonly baseUrl = 'http://localhost:3005';

  constructor(private readonly http: HttpService) {}

  async requestTransfer(email: string, amount: number): Promise<void> {
    try {
      const response$ = this.http.post(`${this.baseUrl}/debin/transfer`, {
        email,
        amount,
      });

      const response = await firstValueFrom(response$);
      if (!response.data.success) {
        throw new Error(`Request rejected: ${response.data.message}`);
      }
    } catch (error) {
      if (error.response && error.response.data?.message) {
        throw new Error(`DEBIN error: ${error.response.data.message}`);
      } else {
        throw new Error(`Error contacting DEBIN: ${error.message}`);
      }
    }
  }
}
