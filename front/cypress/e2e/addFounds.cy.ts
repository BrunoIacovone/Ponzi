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
    cy.get('input[placeholder="Bank Email"]').type('mark@mail.com');
    cy.get('button[type=submit]').click();
  });
});
