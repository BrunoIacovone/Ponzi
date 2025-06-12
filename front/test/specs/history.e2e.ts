import { login, logout, enterWebViewContext } from '../utils/helper';
import { $, $$, browser, expect } from '@wdio/globals';

describe('Transaction History Page', () => {
  before(async () => {
    await login();
  });

  beforeEach(async () => {
    await enterWebViewContext();
    const historyBtn = await $('button[name="history"]');
    await historyBtn.waitForDisplayed({ timeout: 5000 });
    await historyBtn.click();
  });

  after(async () => {
    await logout();
  });

  it('should load the page and display the title', async () => {
    const title = await $('//*[contains(text(), "Transaction History")]');
    await title.waitForDisplayed({ timeout: 5000 });
    expect(title).toBeDisplayed();
    await $('//button[contains(text(), "Go back to Dashboard")]').click();
  });

  it('should filter by type (Income)', async () => {
    const select = await $('[data-cy="filter-transaction-type"]');
    await select.selectByVisibleText('Income');

    const items = await $$('[data-cy="transaction-item"]');
    for (const item of items) {
      const text = await item.getText();
      expect(text.includes('+ $')).toBe(true);
      expect(text.includes('- $')).toBe(false);
    }
    await $('//button[contains(text(), "Go back to Dashboard")]').click();
  });

  it('should filter by type (Expense)', async () => {
    const select = await $('[data-cy="filter-transaction-type"]');
    await select.selectByVisibleText('Expense');

    const items = await $$('[data-cy="transaction-item"]');
    for (const item of items) {
      const text = await item.getText();
      expect(text.includes('- $')).toBe(true);
      expect(text.includes('+ $')).toBe(false);
    }
    await $('//button[contains(text(), "Go back to Dashboard")]').click();
  });

  it('should filter by date range', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    const fromInput = await $$('input[type="date"]')[0];
    const toInput = await $$('input[type="date"]')[1];

    await fromInput.setValue(formatDate(lastMonth));
    await toInput.setValue(formatDate(tomorrow));

    const items = await $$('[data-cy="transaction-item"]');
    for (const item of items) {
      const text = await item.getText();
      const match = text.match(/\d{2}\/\d{2}\/\d{4}/);
      expect(match).not.toBe(null);

      const [day, month, year] = match![0].split('/').map(Number);
      const txDate = new Date(year, month - 1, day);

      expect(txDate >= lastMonth && txDate <= tomorrow).toBe(true);
    }
    await $('//button[contains(text(), "Go back to Dashboard")]').click();
  });
});
