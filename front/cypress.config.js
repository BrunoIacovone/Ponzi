import { defineConfig } from 'cypress';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    setupNodeEvents(on, config) {
      config.env.CYPRESS_EMAIL = process.env.CYPRESS_EMAIL;
      config.env.CYPRESS_PASSWORD = process.env.CYPRESS_PASSWORD;
      return config;
    },
    env: {
      tsConfig: 'tsconfig.cypress.json',
    },
  },
});
