/// <reference types="cypress" />

describe('Register Page', () => {
  beforeEach(() => {
    cy.visit('/signup');
  });

  it('Should tell the user to fill the email field', () => {
    cy.get('button[type=submit]').click();

    cy.wait(2000);
    cy.url().should('include', '/signup');
    cy.contains('Crear cuenta').should('be.visible');

    cy.get('input[type=email]').clear();
    cy.get('input[type=password]').clear();
  });

  it('No debe crear la cuenta si el email es inválido', () => {
    cy.get('input[type=email]').type('a');
    cy.get('input[type=password]').type('12345678');
    cy.get('button[type=submit]').click();

    cy.wait(2000);
    cy.url().should('include', '/signup');
    cy.contains('Crear cuenta').should('be.visible');

    cy.get('input[type=email]').clear();
    cy.get('input[type=password]').clear();
  });

  it('No debe crear la cuenta si no hay contraseña', () => {
    cy.get('input[type=email]').type('a@a.com');
    cy.get('button[type=submit]').click();

    cy.wait(2000);
    cy.url().should('include', '/signup');
    cy.contains('Crear cuenta').should('be.visible');

    cy.get('input[type=email]').clear();
    cy.get('input[type=password]').clear();
  });

  it('No debe crear la cuenta si el email ya existe', () => {
    cy.get('input[type=email]').type('test@mail.com');
    cy.get('input[type=password]').type('12345678');
    cy.get('button[type=submit]').click();

    cy.contains('Firebase: Error (auth/email-already-in-use).').should(
      'be.visible',
    );

    cy.get('input[type=email]').clear();
    cy.get('input[type=password]').clear();
  });

  it('Debe crear la cuenta si el email y la contraseña son válidos', () => {
    const uniqueEmail = `test${Date.now()}@mail.com`;
    cy.get('input[type=email]').type(uniqueEmail);
    cy.get('input[type=password]').type('12345678');
    cy.get('button[type=submit]').click();

    cy.wait(2000);
    cy.logout();
  });
});
