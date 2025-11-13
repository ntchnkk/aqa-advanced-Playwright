import { test, expect } from "@playwright/test";
import HomePage from "../pages/HomePage";
import SignUpForm from "../forms/SignUpForm";
import GaragePage from "../pages/GaragePage";
import { invalidPasswords } from "../test-data/passwords";
import { invalidEmails } from "../test-data/emails";
import { repeatPasswordScenarios } from "../test-data/repeatPasswords";

let homePage: HomePage;
let signUpForm: SignUpForm;
let garagePage: GaragePage;

test.describe("Sign up form", () => {
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    signUpForm = new SignUpForm(page);
    garagePage = new GaragePage(page);

    await homePage.open();
    await homePage.clickSignUpButton();
    await expect(signUpForm.signUpModal).toBeVisible();
  });

  test.describe("UI and Initial State", () => {
    test("Sign up form opens and is visible", async () => {
      await expect(signUpForm.signUpModal).toBeVisible();
    });

    test("All elements on the form are visible", async () => {
      await expect(signUpForm.registrationTitle).toBeVisible();
      await expect(signUpForm.closeButton).toBeVisible();
      await signUpForm.checkAllFieldsVisible();
    });

    test("Register button is visible and disabled by default", async () => {
      await expect(signUpForm.registerButton).toBeVisible();
      await expect(signUpForm.registerButton).toBeDisabled();
    });

    test("All fields are empty when the form opens", async () => {
      await signUpForm.checkAllFieldsEmpty();
    });

    test("No errors for input fields by default", async () => {
      await signUpForm.checkNoFieldErrors();
    });
  });

  test.describe("Behavior and Interaction", () => {
    test("Register button becomes enabled only when all fields are valid", async () => {
      await signUpForm.fillAllSignUpFields({
        name: "Rina",
        lastName: "AQA",
        email: `aqa-rina.n.qa+${Date.now()}@gmail.com`,
        password: "123Aq!@#$%^&*",
        repeatPassword: "123Aq!@#$%^&*",
      });
      await expect(signUpForm.registerButton).toBeEnabled();
    });

    test("Register button is disabled when at least one field is not valid", async () => {
      await signUpForm.fillAllSignUpFields({
        name: "Aa".repeat(10),
        lastName: "Bb".repeat(10),
        email: `aqa-rina.n.qa+${Date.now()}@gmail.com`,
        password: "ValidPa1",
        repeatPassword: "ValidPa1",
      });

      await expect(signUpForm.registerButton).toBeEnabled();
      await signUpForm.randomSignUpField.fill("");
      await expect(signUpForm.registerButton).toBeDisabled();
    });

    test("Error message disappears after correcting invalid input", async () => {
      await signUpForm.fillField(signUpForm.nameField, "A");
      await signUpForm.verifyErrorMessageVisibility(1);
      await signUpForm.fillField(signUpForm.nameField, "Kate");
      await signUpForm.verifyErrorMessageVisibility(0);
    });

    test("Sign up form is closed by close icon", async () => {
      await signUpForm.closeButton.click();
      await expect(signUpForm.signUpModal).not.toBeVisible();
    });

    test("Form clears all fields after closing and reopening", async () => {
      const userData = {
        name: "Norah",
        lastName: "Leray",
        email: `aqa-rina.n.qa+${Date.now()}@gmail.com`,
        password: "Password1234567",
        repeatPassword: "Password1234567",
      };

      await signUpForm.fillAllSignUpFields(userData);
      await signUpForm.verifyFieldValues(userData);
      await signUpForm.closeButton.click();
      await expect(signUpForm.signUpModal).toHaveCount(0);
      await homePage.clickSignUpButton();
      await expect(signUpForm.signUpModal).toBeVisible();
      await signUpForm.checkAllFieldsEmpty();
    });

    test("Spaces are trimmed in 'Name' field", async () => {
      await signUpForm.fillField(signUpForm.nameField, "  Kate  ");
      await expect(signUpForm.nameField).toHaveValue("Kate");
    });

    test("Spaces are trimmed in 'Last name' field", async () => {
      await signUpForm.fillField(signUpForm.lastNameField, "  Lastname  ");
      await expect(signUpForm.lastNameField).toHaveValue("Lastname");
    });
  });

  test.describe("Positive test cases", () => {
    test("New user is registered with valid data", async () => {
      const userData = {
        name: "Li",
        lastName: "Wu",
        email: `aqa-rina.n.qa+${Date.now()}@gmail.com`,
        password: "ValidPassword12",
        repeatPassword: "ValidPassword12",
      };
      await signUpForm.fillAllSignUpFields(userData);
      await signUpForm.registerButton.click();
      await garagePage.verifyGaragePageIsOpen();
      await garagePage.logOutButton.click();
    });
  });

  test.describe("Negative test cases", () => {
    test("User is not registered with already existing email", async () => {
      const email = `aqa-rina.n.qa+${Date.now()}@gmail.com`;

      await signUpForm.fillAllSignUpFields({
        name: "Anna",
        lastName: "Smith",
        email,
        password: "123456Vp",
        repeatPassword: "123456Vp",
      });
      await signUpForm.registerButton.click();
      await garagePage.verifyGaragePageIsOpen();
      await garagePage.logOutButton.click();
      await homePage.clickSignUpButton();
      await expect(signUpForm.signUpModal).toBeVisible();
      await signUpForm.fillAllSignUpFields({
        name: "Valery",
        lastName: "Frost",
        email,
        password: "123456Pv",
        repeatPassword: "123456Pv",
      });
      await signUpForm.registerButton.click();
      await expect(signUpForm.existingUserError).toBeVisible();
    });

    test.describe('Field "Name"', () => {
      test("Error message is shown for empty 'Name' field", async ({}) => {
        await signUpForm.verifyFieldErrorMessage(
          signUpForm.nameField,
          "",
          "Name required"
        );
      });

      test("Error message is shown for too short name", async () => {
        await signUpForm.verifyFieldErrorMessage(
          signUpForm.nameField,
          "A",
          "Name has to be from 2 to 20 characters long"
        );
      });

      test("Error message is shown for too long name", async () => {
        await signUpForm.verifyFieldErrorMessage(
          signUpForm.nameField,
          "W".repeat(21),
          "Name has to be from 2 to 20 characters long"
        );
      });

      test("Error message is shown for non-English letters in 'Name' field", async () => {
        await signUpForm.verifyFieldErrorMessage(
          signUpForm.nameField,
          "Abigaëlle",
          "Name is invalid"
        );
      });

      test("Error message is shown for special characters in 'Name' field", async () => {
        await signUpForm.verifyFieldErrorMessage(
          signUpForm.nameField,
          "Terry-'!#$",
          "Name is invalid"
        );
      });

      test("Error message is shown for numbers in 'Name' field", async () => {
        await signUpForm.verifyFieldErrorMessage(
          signUpForm.nameField,
          "666Test",
          "Name is invalid"
        );
      });

      test("Two error messages are shown for invalid too long name", async () => {
        await signUpForm.fillField(
          signUpForm.nameField,
          "A                   y"
        );
        await signUpForm.verifyErrorMessageVisibility(2);
        await expect(signUpForm.fieldErrorMessage.nth(0)).toHaveText(
          "Name is invalid"
        );
        await expect(signUpForm.fieldErrorMessage.nth(1)).toHaveText(
          "Name has to be from 2 to 20 characters long"
        );
      });
    });

    test.describe('Field "Last name"', () => {
      test("Error message is shown for empty 'Last name' field", async () => {
        await signUpForm.verifyFieldErrorMessage(
          signUpForm.lastNameField,
          "",
          "Last name required"
        );
      });

      test("Error message is shown for too short last name", async () => {
        await signUpForm.verifyFieldErrorMessage(
          signUpForm.lastNameField,
          "l",
          "Last name has to be from 2 to 20 characters long"
        );
      });

      test("Error message is shown for too long last name", async () => {
        await signUpForm.verifyFieldErrorMessage(
          signUpForm.lastNameField,
          "W".repeat(21),
          "Last name has to be from 2 to 20 characters long"
        );
      });

      test("Error message is shown for non-English letters in 'Last name' field", async () => {
        await signUpForm.verifyFieldErrorMessage(
          signUpForm.lastNameField,
          "Krüger",
          "Last name is invalid"
        );
      });

      test("Error message is shown for special characters in 'Last name' field", async () => {
        await signUpForm.verifyFieldErrorMessage(
          signUpForm.lastNameField,
          "O'Henry-Kruz",
          "Last name is invalid"
        );
      });

      test("Error message is shown for numbers in 'Last name' field", async () => {
        await signUpForm.verifyFieldErrorMessage(
          signUpForm.lastNameField,
          "Lastname2",
          "Last name is invalid"
        );
      });

      test("Two error messages are shown for invalid too long last name", async () => {
        await signUpForm.fillField(
          signUpForm.lastNameField,
          "Spencer-Churchill-Douglas"
        );
        await signUpForm.verifyErrorMessageVisibility(2);
        await expect(signUpForm.fieldErrorMessage.nth(0)).toHaveText(
          "Last name is invalid"
        );
        await expect(signUpForm.fieldErrorMessage.nth(1)).toHaveText(
          "Last name has to be from 2 to 20 characters long"
        );
      });
    });

    test.describe('Field "Email"', () => {
      test("Error message is shown for empty 'Email' field", async () => {
        await signUpForm.verifyFieldErrorMessage(
          signUpForm.emailField,
          "",
          "Email required"
        );
      });

      invalidEmails.forEach((email) => {
        test(`shows error for invalid email: ${email}`, async () => {
          await signUpForm.verifyInvalidEmail(email);
        });
      });
    });

    test.describe('Field "Password"', () => {
      test("Error message is shown for empty 'Password' field", async () => {
        await signUpForm.verifyFieldErrorMessage(
          signUpForm.passwordField,
          "",
          "Password required"
        );
      });

      invalidPasswords.forEach((pwd) => {
        test(`Error message is shown for ${pwd.scenario}`, async () => {
          await signUpForm.fillField(signUpForm.passwordField, pwd.value);
          await signUpForm.verifyErrorMessageVisibility(1);
          await expect(signUpForm.fieldErrorMessage).toHaveText(
            "Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter"
          );
        });
      });
    });

    test.describe('Field "Repeat Password"', () => {
      test("Error message is shown for empty 'Repeat Password' field", async () => {
        await signUpForm.verifyFieldErrorMessage(
          signUpForm.repeatPasswordField,
          "",
          "Re-enter password required"
        );
      });

      test("Error message is shown for non-matching password", async () => {
        await signUpForm.fillField(signUpForm.passwordField, "Password12");
        await signUpForm.fillField(
          signUpForm.repeatPasswordField,
          "Password13"
        );
        await signUpForm.verifyErrorMessageVisibility(1);
        await expect(signUpForm.fieldErrorMessage).toHaveText(
          "Passwords do not match"
        );
      });

      repeatPasswordScenarios.forEach((scenario) => {
        test(`Error message is shown for ${scenario.scenario}`, async () => {
          await signUpForm.fillField(
            signUpForm.repeatPasswordField,
            scenario.value
          );
          await signUpForm.verifyErrorMessageVisibility(1);
          await expect(signUpForm.fieldErrorMessage).toHaveText(
            "Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter"
          );
        });
      });
    });
  });
});
