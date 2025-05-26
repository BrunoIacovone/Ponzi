/// <reference types="cypress" />


describe('Dashboard Page', () => {
  beforeEach(() => {
    cy.login();
  })


  it('should display "Current Balance" on the dashboard', () => {
    cy.contains('Current Balance').should('be.visible');
  });
});