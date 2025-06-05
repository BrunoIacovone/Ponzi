/// <reference types="cypress" />

describe('Add Funds Page', () => {

  beforeEach(() => {
    cy.login();
  });

  afterEach(() => {
    cy.logout();
  });

  it('should add founds to the account', () => {
    cy.get('button[name=add-founds]').click();
    cy.get('input[name=amount]').type('100');
    cy.get('button[name=bank]').click();
    cy.get('input[placeholder="Bank Account"]').type('1234567890');
    cy.get('input[placeholder="CBU/ALIAS"]').type('banco.inventado');
    cy.get('button[type=submit]').click();
  });
});
