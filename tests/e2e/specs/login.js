import { errorMessages, invalidEmailAddresses } from './common'

const page_elements = {
  inputs: {
    email: '[data-cy="input-email"]',
    password: '[data-cy="input-password"]'
  },
  buttons: {
    login: '[data-cy="button-login"]'
  },
  text: {
    register: '[data-cy="text-register"]',
    success: '[data-cy="text-success"]',
    error: '[data-cy="text-error"]'
  }
}

const existingAccountCreds = {
  email: 'super@secret.com',
  password: '1234567890',
  incorrectPassword: 'abcdefg'
}

const nonExistentAccountCreds = {
  email: 'correctly@formatted.com',
  password: 'arbitrarypass123'
}

const login = (email, password) => {
  cy.visit('/login')

  if (email) {
    cy.get(page_elements.inputs.email)
      .clear()
      .type(email)
  }

  if (password) {
    cy.get(page_elements.inputs.password)
      .clear()
      .type(password)
  }

  // Initiate the login
  cy.get(page_elements.buttons.login).click()
}

const validateErrorMessage = expectedMessage => {
  cy.get(page_elements.text.error).should('contain', expectedMessage)
}

describe('The login page', () => {
  it('Should contain the required fields', () => {
    // Navigate to login form
    cy.visit('/login')

    // Assert that form elements exist
    cy.get(page_elements.inputs.email).should('exist')
    cy.get(page_elements.inputs.password).should('exist')
    cy.get(page_elements.buttons.login).should('exist')

    // Assert that the registration form is accessible
    cy.get(page_elements.text.register)
      .should('exist')
      .should('contain', "Don't have an account yet?")
  })

  it('Should login successfully with correct credentials', () => {
    login(existingAccountCreds.email, existingAccountCreds.password)

    // Assert that the login was successful
    cy.get(page_elements.text.success)
      .should('exist')
      .should('contain', 'You have been successfully logged in!')
  })

  it('Should error when logging in with an incorrect password', () => {
    login(existingAccountCreds.email, existingAccountCreds.incorrectPassword)
    validateErrorMessage(errorMessages.failedAuth)
  })

  it('Should error when logging in with a non-existent account', () => {
    login(nonExistentAccountCreds.email, nonExistentAccountCreds.password)
    validateErrorMessage(errorMessages.failedAuth)
  })

  it('Should error when logging in with a missing email address', () => {
    login('', existingAccountCreds.password)
    validateErrorMessage(errorMessages.invalidEmail)
  })

  for (let invalidEmailAddress of invalidEmailAddresses) {
    it(`Should error when logging in with an invalid email address - ${invalidEmailAddress}`, () => {
      login(invalidEmailAddress, existingAccountCreds.password)
      validateErrorMessage(errorMessages.invalidEmail)
    })
  }

  it('Should error when logging in with a missing password', () => {
    login(existingAccountCreds.email, '')
    validateErrorMessage(errorMessages.missingPassword)
  })

  it('Should provide a working link to the Register page', () => {
    // Click the register button
    cy.get(page_elements.text.register)
      .get('a')
      .click()

    // Assert the register page was loaded
    cy.location('pathname').should('eq', '/register')
  })
})
