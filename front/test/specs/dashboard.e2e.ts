import { login, logout, enterWebViewContext } from '../utils/helper';
import { $, expect } from '@wdio/globals';

describe('Dashboard Page', () => {
  beforeEach(async () => {
    await login();
  });

  afterEach(async () => {
    await logout();
  });

  it('should display "Current Balance" on the dashboard', async () => {
    await enterWebViewContext();

    const balanceText = await $('//*[contains(text(), "Current Balance")]');
    await balanceText.waitForDisplayed({ timeout: 5000 });
    expect(balanceText).toBeDisplayed();
  });
});
