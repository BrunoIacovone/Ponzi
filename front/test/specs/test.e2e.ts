import { expect, browser, $ } from '@wdio/globals';

describe('Mi app con Capacitor', () => {
  it('debería cargar correctamente el WebView', async () => {
    const contexts = await browser.getContexts();
    console.log('Contextos disponibles:', contexts);

    // Cambiar al contexto WEBVIEW
    const webviewContext = contexts.find((ctx) => ctx.includes('WEBVIEW'));
    expect(webviewContext).toBeDefined();
    await browser.switchContext(webviewContext!);

    // Validar que algo se muestre dentro del HTML
    const body = await $('body');
    await expect(body).toBeDisplayed();

    // O podés buscar por un texto visible
    // const titulo = await $('h1=Inicio') // si tenés un <h1>Inicio</h1>
    // await expect(titulo).toBeDisplayed()
  });
});
