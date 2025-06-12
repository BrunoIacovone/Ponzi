import { login, logout, enterWebViewContext } from '../utils/helper';
import { $, expect } from '@wdio/globals';

describe('Add Funds Page', () => {
  before(async () => {
    await login();
  });

  beforeEach(async () => {
    await enterWebViewContext();

    const addFundsBtn = await $('button[name="add-founds"]');
    await addFundsBtn.waitForDisplayed({ timeout: 5000 });
    await addFundsBtn.click();
  });

  after(async () => {
    await logout();
  });

  it('should not add funds with invalid email', async () => {
    await $('input[type="number"]').setValue('100');
    await $('input[placeholder="Bank Email"]').setValue('invalid@mail');
    await $('button[type="submit"]').click();

    const error = await $('.error');
    await error.waitForDisplayed({ timeout: 5000 });
    expect(error).toBeDisplayed();
    await $('//button[contains(text(), "Go back to Dashboard")]').click();
  });

  it('should not add funds with invalid amount', async () => {
    await $('input[type="number"]').setValue('-1');
    await $('input[placeholder="Bank Email"]').setValue('mark@mail.com');
    await $('button[type="submit"]').click();

    const error = await $('//*[contains(text(), "Amount must be greater than 0")]');
    await error.waitForDisplayed({ timeout: 5000 });
    expect(error).toBeDisplayed();
    await $('//button[contains(text(), "Go back to Dashboard")]').click();
  });

  it('should not add funds with a non existing bank email', async () => {
    await $('input[type="number"]').setValue('100');
    await $('input[placeholder="Bank Email"]').setValue('sasi@mail.com');
    await $('button[type="submit"]').click();

    const error = await $('//*[contains(text(), "Account not found")]');
    await error.waitForDisplayed({ timeout: 5000 });
    expect(error).toBeDisplayed();
    await $('//button[contains(text(), "Go back to Dashboard")]').click();
  });

  it("should not add funds if the amount is greater than the bank's funds", async () => {
    await $('input[type="number"]').setValue('999');
    await $('input[placeholder="Bank Email"]').setValue('bruno@mail.com');
    await $('button[type="submit"]').click();

    const error = await $('//*[contains(text(), "Insufficient funds")]');
    await error.waitForDisplayed({ timeout: 5000 });
    expect(error).toBeDisplayed();
    await $('//button[contains(text(), "Go back to Dashboard")]').click();
  });

  it('should add funds to the account', async () => {
    await $('input[type="number"]').setValue('100');
    await $('input[placeholder="Bank Email"]').setValue('mark@mail.com');
    await $('button[type="submit"]').click();

    const confirmation = await $('//*[contains(normalize-space(.), "+ $100")]');
    await confirmation.waitForDisplayed({ timeout: 5000 });
    expect(confirmation).toBeDisplayed();
  });
});
