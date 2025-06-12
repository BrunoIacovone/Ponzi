/// <reference types="cypress" />

describe('Add Funds Page', () => {
  beforeEach(() => {
    cy.login();
    cy.get('button[name=add-founds]').click();
  });

  afterEach(() => {
    cy.logout();
  });

  it('should not add funds with invalid email', () => {
    cy.get('input[type="number"]').type('100');
    cy.get('input[placeholder="Bank Email"]').type(`invalid@mail`);
    cy.get('button[type=submit]').click();
    cy.contains('Invalid email address').should('be.visible');
  });

  it('should not add funds with invalid amount', () => {
    cy.get('input[type="number"]').type('-1');
    cy.get('input[placeholder="Bank Email"]').type('mark@mail.com');
    cy.get('button[type=submit]').click();
    cy.contains('Amount must be greater than 0').should('be.visible');
  });

  it('should not add funds with a non existing bank email', () => {
    cy.get('input[type="number"]').type('100');
    cy.get('input[placeholder="Bank Email"]').type('sasi@mail.com');
    cy.get('button[type=submit]').click();
    cy.contains('DEBIN error: Account not found').should('be.visible');
  });

  it("should not add funds if the amount is greater than the bank's funds", () => {
    cy.get('input[type="number"]').type('999');
    cy.get('input[placeholder="Bank Email"]').type('bruno@mail.com');
    cy.get('button[type=submit]').click();
    cy.contains('DEBIN error: Insufficient funds').should('be.visible');
  });

  it('should add funds to the account', () => {
    cy.get('input[type="number"]').type('100');
    cy.get('input[placeholder="Bank Email"]').type('mark@mail.com');
    cy.get('button[type=submit]').click();
    cy.contains('+ $100').should('be.visible');
  });
});
