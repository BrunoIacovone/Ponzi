/// <reference types="cypress" />

describe('Transaction History Page', () => {
  beforeEach(() => {
    cy.login();
    cy.get('button[name=history]').click();
  });

  afterEach(() => {
    cy.logout();
  });

  it('should load the page and display the title', () => {
    cy.contains('Transaction History').should('be.visible');
  });

  it('should filter by type (e.g. Income)', () => {
    cy.get('select[data-cy=filter-transaction-type]').select('Income');
    cy.get('[data-cy=transaction-item]').each(($el) => {
      cy.wrap($el).should('contain', '+ $').and('not.contain', '- $');
    });
  });

  it('should filter by type (e.g. Expense)', () => {
    cy.get('select[data-cy=filter-transaction-type]').select('Expense');
    cy.get('[data-cy=transaction-item]').each(($el) => {
      cy.wrap($el).should('contain', '- $').and('not.contain', '+ $');
    });
  });

  it('should filter by date range', () => {
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));
    const lastMonth = new Date();
    lastMonth.setMonth(tomorrow.getMonth() - 1);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    cy.get('input[type="date"]').eq(0).type(formatDate(lastMonth));
    cy.get('input[type="date"]').eq(1).type(formatDate(tomorrow));

    cy.get('[data-cy=transaction-item]').each(($el) => {
      cy.wrap($el)
        .invoke('text')
        .then((text) => {
          const match = text.match(/\d{2}\/\d{2}\/\d{4}/);
          expect(match).to.not.be.null;

          const [day, month, year] = match![0].split('/').map(Number);
          const txDate = new Date(year, month - 1, day);

          expect(txDate >= lastMonth && txDate <= tomorrow).to.be.true;
        });
    });
  });

  it('should show no transactions if the date range is invalid (e.g. since is later than until)', () => {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    cy.get('input[type="date"]').eq(0).type(formatDate(today)); // since
    cy.get('input[type="date"]').eq(1).type(formatDate(oneMonthAgo)); // until
    cy.get('[data-cy=transaction-item]').should('have.length', 0);
    cy.contains('No transactions found').should('exist'); // only if such a message exists
  });
});
