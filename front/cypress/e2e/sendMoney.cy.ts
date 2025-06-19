/// <reference types="cypress" />

describe('Send Money Page', () => {
  beforeEach(() => {
    cy.login();
    cy.get('button[name=send-money]').click();
  });

  afterEach(() => {
    cy.logout();
  });

  it('should not send money with invalid email', () => {
    cy.get('input[type=number]').type('10');
    cy.get('input[type=email]').type(`invalid@${Date.now()}`);
    cy.get('button[type=submit]').click();
    cy.contains('must be an email').should('be.visible');
  });

  it('should not send money with invalid amount', () => {
    cy.get('input[type=number]').type('-1');
    cy.get('input[type=email]').type(`valid@mail.com`);
    cy.get('button[type=submit]').click();
    cy.contains('amount must not be less than 1').should('be.visible');
  });

  it('should not send money to themselves', () => {
    cy.get('input[type=number]').type('10');
    cy.get('input[type=email]').type(Cypress.env('CYPRESS_EMAIL'));
    cy.get('button[type=submit]').click();
    cy.contains('Cannot send money to yourself').should('be.visible');
  });

  it('should not send money to a non-existing account', () => {
    cy.get('input[type=number]').type('10');
    cy.get('input[type=email]').type(`nonexisting@mail.com`);
    cy.get('button[type=submit]').click();
    cy.contains('Recipient mail is invalid').should('be.visible');
  });

  it('should not allow sending more money than the current balance', () => {
    cy.visit('/');
    cy.wait(1000);
    cy.get('[data-cy=balance-display]')
      .invoke('text')
      .then((text) => {
        const match = text.match(/[\d,.]+/); // extract the first number like "450.00"
        const balance = match ? parseFloat(match[0].replace(',', '')) : 0;
        cy.get('button[name=send-money]').click();
        cy.get('input[type=number]').type((balance + 1).toString());
        cy.get('input[type=email]').type('maxsasysallemi@gmail.com');
        cy.get('button[type=submit]').click();
        cy.contains('Insufficient funds').should('be.visible');
      });
  });

  it('should send money to another account', () => {
    cy.get('input[type=number]').type('10');
    cy.get('input[type=email]').type('maxsasysallemi@gmail.com');
    cy.get('button[type=submit]').click();
    cy.contains('- $10').should('be.visible');
    cy.get('button[name=add-founds]').click();
    cy.get('input[type="number"]').type('10');
    cy.get('input[placeholder="Bank Email"]').type('mark@mail.com');
    cy.get('button[type=submit]').click();
  });
});
