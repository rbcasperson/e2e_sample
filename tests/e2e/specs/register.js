import { errorMessages, invalidEmailAddresses } from './common'

const page_elements = {
  inputs: {
    fullName: '[data-cy="input-full-name"]',
    email: '[data-cy="input-email"]',
    password: '[data-cy="input-password"]',
    passwordConfirmation: '[data-cy="input-password-confirmation"]'
  },
  buttons: {
    register: '[data-cy="button-register"]'
  },
  text: {
    login: '[data-cy="text-login"]',
    success: '[data-cy="text-success"]',
    error: '[data-cy="text-error"]'
  }
}

const validNewUserData = {
  fullName: 'John Doe',
  email: 'john@doe.com',
  password: 'password-greater-than-8-chars'
}

const register = (fullName, email, password, passwordConfirmation) => {
  if (fullName) {
    cy.get(page_elements.inputs.fullName)
      .clear()
      .type(fullName)
  }

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

  if (passwordConfirmation) {
    cy.get(page_elements.inputs.passwordConfirmation)
      .clear()
      .type(passwordConfirmation)
  }

  // Initiate the registration
  cy.get(page_elements.buttons.register).click()
}

const validateErrorMessage = expectedMessage => {
  cy.get(page_elements.text.error).should('contain', expectedMessage)
}

describe('The registration page', () => {
  beforeEach(() => {
    // Navigate to login form
    cy.visit('/register')
  })

  it('Should contain the required fields', () => {
    // Assert that form elements exist
    cy.get(page_elements.inputs.fullName).should('exist')
    cy.get(page_elements.inputs.email).should('exist')
    cy.get(page_elements.inputs.password).should('exist')
    cy.get(page_elements.inputs.passwordConfirmation).should('exist')
    cy.get(page_elements.buttons.register).should('exist')

    // Assert that the registration form is accessible
    cy.get(page_elements.text.login)
      .should('exist')
      .should('contain', 'Already have an account?')
  })

  it('Should login successfully with correct credentials', () => {
    register(
      validNewUserData.fullName,
      validNewUserData.email,
      validNewUserData.password,
      validNewUserData.password
    )

    // Assert that the login was successful
    cy.get(page_elements.text.success)
      .should('exist')
      .should('contain', 'You have successfully registered!')
  })

  it('Should error when registering with a missing Full Name', () => {
    register(
      '',
      validNewUserData.email,
      validNewUserData.password,
      validNewUserData.password
    )
    validateErrorMessage(errorMessages.missingFullName)
  })

  it('Should error when registering with a missing email', () => {
    register(
      validNewUserData.fullName,
      '',
      validNewUserData.password,
      validNewUserData.password
    )
    validateErrorMessage(errorMessages.invalidEmail)
  })

  it('Should error when registering with a missing password', () => {
    register(validNewUserData.fullName, validNewUserData.email, '', '')
    validateErrorMessage(errorMessages.invalidPassword)
  })

  it('Should error when registering with a password that is too short', () => {
    const minPasswordLength = 8
    const tooShortPass = new Array(minPasswordLength).join('a')
    register(
      validNewUserData.fullName,
      validNewUserData.email,
      tooShortPass,
      tooShortPass
    )
    validateErrorMessage(errorMessages.invalidPassword)
  })

  for (let invalidEmailAddress of invalidEmailAddresses) {
    it(`Should error when registering with an invalid email - ${invalidEmailAddress}`, () => {
      register(
        validNewUserData.fullName,
        invalidEmailAddress,
        validNewUserData.password,
        validNewUserData.password
      )
      validateErrorMessage(errorMessages.invalidEmail)
    })
  }

  it('Should error when registering with mismatched passwords', () => {
    register(
      validNewUserData.fullName,
      validNewUserData.email,
      validNewUserData.password,
      validNewUserData.password + 'more'
    )
    validateErrorMessage(errorMessages.passwordMismatch)
  })

  it('Should provide a working link to the Login page', () => {
    // Click the login button
    cy.get(page_elements.text.login)
      .get('a')
      .click()

    // Assert the Login page was loaded
    cy.location('pathname').should('eq', '/login')
  })
})
