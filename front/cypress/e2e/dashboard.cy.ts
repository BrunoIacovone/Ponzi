/// <reference types="cypress" />

describe('Dashboard Page', () => {
  beforeEach(() => {
    cy.login();
  });

  afterEach(() => {
    cy.logout();
  });

  it('should display "Current Balance" on the dashboard', () => {
    cy.contains('Current Balance').should('be.visible');
  });
});
