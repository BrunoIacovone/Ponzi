import { login, logout, enterWebViewContext } from '../utils/helper';
import { $, expect, browser } from '@wdio/globals';

describe('Send Money Page', () => {
  before(async () => {
    await login();
  });

  beforeEach(async () => {
    await enterWebViewContext();
    const sendBtn = await $('button[name="send-money"]');
    await sendBtn.waitForDisplayed({ timeout: 5000 });
    await sendBtn.click();
  });

  after(async () => {
    await logout();
  });

  it('should not send money with invalid email', async () => {
    await $('input[type="number"]').setValue('10');
    await $('input[type="email"]').setValue(`invalid@${Date.now()}`);
    await $('button[type="submit"]').click();

    const error = await $('//*[contains(text(), "must be an email")]');
    await error.waitForDisplayed({ timeout: 5000 });
    expect(error).toBeDisplayed();
    await $('//button[contains(text(), "Go back to Dashboard")]').click();
  });

  it('should not send money with invalid amount', async () => {
    await $('input[type="number"]').setValue('-1');
    await $('input[type="email"]').setValue('valid@mail.com');
    await $('button[type="submit"]').click();

    const error = await $(
      '//*[contains(text(), "amount must not be less than 1")]',
    );
    await error.waitForDisplayed({ timeout: 5000 });
    expect(error).toBeDisplayed();
    await $('//button[contains(text(), "Go back to Dashboard")]').click();
  });

  it('should not send money to themselves', async () => {
    await $('input[type="number"]').setValue('10');
    await $('input[type="email"]').setValue(process.env.CYPRESS_EMAIL!);
    await $('button[type="submit"]').click();

    const error = await $(
      '//*[contains(text(), "Cannot send money to yourself")]',
    );
    await error.waitForDisplayed({ timeout: 5000 });
    expect(error).toBeDisplayed();
    await $('//button[contains(text(), "Go back to Dashboard")]').click();
  });

  it('should not send money to a non-existing account', async () => {
    await $('input[type="number"]').setValue('10');
    await $('input[type="email"]').setValue('nonexisting@mail.com');
    await $('button[type="submit"]').click();

    const error = await $('//*[contains(text(), "Recipient mail is invalid")]');
    await error.waitForDisplayed({ timeout: 5000 });
    expect(error).toBeDisplayed();
    await $('//button[contains(text(), "Go back to Dashboard")]').click();
  });

  it('should not allow sending more money than the current balance', async () => {
    await $('//button[contains(text(), "Go back to Dashboard")]').click();
    const balanceEl = await $('[data-cy="balance-display"]');
    const balanceText = await balanceEl.getText();
    const match = balanceText.match(/[\d,.]+/);
    const balance = match ? parseFloat(match[0].replace(',', '')) : 0;

    const sendBtn = await $('button[name="send-money"]');
    await sendBtn.click();

    await $('input[type="number"]').setValue((balance + 1).toString());
    await $('input[type="email"]').setValue('maxsasysallemi@gmail.com');
    await $('button[type="submit"]').click();

    const error = await $('//*[contains(text(), "Insufficient funds")]');
    await error.waitForDisplayed({ timeout: 5000 });
    expect(error).toBeDisplayed();
    await $('//button[contains(text(), "Go back to Dashboard")]').click();
  });

  it('should send money to another account', async () => {
    await $('input[type="number"]').setValue('10');
    await $('input[type="email"]').setValue('maxsasysallemi@gmail.com');
    await $('button[type="submit"]').click();

    const confirmation = await $('//*[contains(normalize-space(.), "- $10")]');
    await confirmation.waitForDisplayed({ timeout: 5000 });
    expect(confirmation).toBeDisplayed();

    await $('button[name="add-founds"]').click();
    await $('input[type="number"]').setValue('10');
    await $('input[placeholder="Bank Email"]').setValue('mark@mail.com');
    await $('button[type="submit"]').click();
  });
});
