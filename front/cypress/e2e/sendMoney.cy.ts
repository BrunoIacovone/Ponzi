/// <reference types="cypress" />

describe('Send Money Page', () => {
  beforeEach(() => {
    cy.login();
  });

  afterEach(() => {
    cy.logout();
  });

  it('should send money to another account', () => {
    cy.get('button[name=send-money]').click();
    cy.get('input[type=number]').type('10');
    cy.get('input[type=email]').type('maxsasysallemi@gmail.com');
    cy.get('button[type=submit]').click();
    cy.contains('- $10').should('be.visible');
  });
});
