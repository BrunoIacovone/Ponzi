import { validate } from 'class-validator';
import { BankDto } from '../../src/dto/bank.dto';
import { DebinDto } from '../../src/dto/debin.dto';
import { SendMoneyDto } from '../../src/dto/send-money.dto';

describe('DTOs validation', () => {
  describe('BankDto', () => {
    it('should pass validation with correct data', async () => {
      const dto = new BankDto();
      dto.bankEmail = 'test@example.com';
      dto.amount = 100;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation if email is invalid', async () => {
      const dto = new BankDto();
      dto.bankEmail = 'invalid-email';
      dto.amount = 100;
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('bankEmail');
    });

    it('should fail validation if amount is not positive', async () => {
      const dto = new BankDto();
      dto.bankEmail = 'test@example.com';
      dto.amount = 0;
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('amount');
    });
  });

  describe('DebinDto', () => {
    it('should pass validation with correct data', async () => {
        const dto = new DebinDto();
        dto.bankEmail = 'test@bank.com';
        dto.amount = 100;
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
      });
  
      it('should fail validation if bankEmail is not an email', async () => {
        const dto = new DebinDto();
        dto.bankEmail = 'not-an-email';
        dto.amount = 100;
        const errors = await validate(dto);
        expect(errors.length).toBe(1);
        expect(errors[0].property).toBe('bankEmail');
      });
  
      it('should fail validation if amount is not a positive number', async () => {
        const dto = new DebinDto();
        dto.bankEmail = 'test@bank.com';
        dto.amount = 0;
        const errors = await validate(dto);
        expect(errors.length).toBe(1);
        expect(errors[0].property).toBe('amount');
      });
  });

  describe('SendMoneyDto', () => {
    it('should pass validation with correct data', async () => {
      const dto = new SendMoneyDto();
      dto.recipientMail = 'recipient@example.com';
      dto.amount = 50;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail if recipientMail is not an email', async () => {
        const dto = new SendMoneyDto();
        dto.recipientMail = 'not-an-email';
        dto.amount = 50;
        const errors = await validate(dto);
        expect(errors.length).toBe(1);
        expect(errors[0].property).toBe('recipientMail');
    });

    it('should fail if amount is not positive', async () => {
        const dto = new SendMoneyDto();
        dto.recipientMail = 'recipient@example.com';
        dto.amount = 0;
        const errors = await validate(dto);
        expect(errors.length).toBe(1);
        expect(errors[0].property).toBe('amount');
      });
  });
}); 