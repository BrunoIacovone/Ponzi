import { $, browser } from '@wdio/globals';

export async function enterWebViewContext() {
  const contexts = await browser.getContexts();
  const webviewContext = contexts.find((c) => c.includes('WEBVIEW'));

  if (!webviewContext) {
    throw new Error(
      'WEBVIEW context not found. Available: ' + contexts.join(', '),
    );
  }

  await browser.switchContext(webviewContext);
}

export async function login() {
  await browser.pause(3000);
  await enterWebViewContext();

  await $('input[name="email"]').setValue(process.env.CYPRESS_EMAIL!);
  await $('input[name="password"]').setValue(process.env.CYPRESS_PASSWORD!);
  await $('button[type="submit"]').click();
}

export async function logout() {
  await browser.pause(1000);
  await enterWebViewContext();

  const logoutBtn = await $('button[name="logout"]');
  if (await logoutBtn.isDisplayed()) {
    await logoutBtn.click();
  }
}
