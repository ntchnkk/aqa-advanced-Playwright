import { expect, Locator } from "@playwright/test";
import BasePage from "../pages/BasePage";

export default class SignUpForm extends BasePage {
  public readonly signUpModal: Locator =
    this.page.locator("//app-signup-modal");

  private readonly modalWindow: Locator = this.page.locator(
    '//ngb-modal-window[contains(@class, "d-block")]'
  );

  public readonly registrationTitle: Locator = this.page.locator(
    "//h4[text()='Registration']"
  );

  public readonly closeButton: Locator = this.page.locator(
    "//button[@class='close']"
  );

  public readonly nameField: Locator = this.page.locator(
    "//input[@id='signupName']"
  );

  public readonly lastNameField: Locator = this.page.locator(
    "//input[@id='signupLastName']"
  );

  public readonly emailField: Locator = this.page.locator(
    "//input[@id='signupEmail']"
  );

  public readonly passwordField: Locator = this.page.locator(
    "//input[@id='signupPassword']"
  );

  public readonly repeatPasswordField: Locator = this.page.locator(
    "//input[@id='signupRepeatPassword']"
  );

  public readonly registerButton: Locator = this.page.getByRole("button", {
    name: "Register",
  });

  public readonly fieldErrorMessage: Locator = this.page.locator(
    '//div[@class="invalid-feedback"]//p'
  );

  public readonly existingUserError: Locator = this.page.locator(
    "p.alert-danger",
    { hasText: "User already exists" }
  );

  public readonly allInputFields: Locator[] = [
    this.nameField,
    this.lastNameField,
    this.emailField,
    this.passwordField,
    this.repeatPasswordField,
  ];

  public readonly randomSignUpFieldIndex = Math.floor(
    Math.random() * this.allInputFields.length
  );

  public readonly randomSignUpField =
    this.allInputFields[this.randomSignUpFieldIndex];

  async clickOutsideForm(): Promise<void> {
    await this.modalWindow.click({ position: { x: 0, y: 0 } });
  }

  async checkAllFieldsVisible(): Promise<void> {
    for (const field of this.allInputFields) {
      await expect(field).toBeVisible();
    }
  }

  async checkAllFieldsEmpty(): Promise<void> {
    for (const field of this.allInputFields) {
      await expect(field).toHaveValue("");
    }
  }

  async checkNoFieldErrors(): Promise<void> {
    for (const field of this.allInputFields) {
      await expect(field).not.toHaveClass(/is-invalid/);
      await expect(field).not.toHaveCSS("border-color", "rgb(220, 53, 69)");
    }
    await expect(this.fieldErrorMessage).toHaveCount(0);
    await expect(this.existingUserError).toHaveCount(0);
  }

  async fillField(field: Locator, info: string): Promise<void> {
    await field.fill(info);
    await field.blur();
  }

  async fillAllSignUpFields({
    name,
    lastName,
    email,
    password,
    repeatPassword,
  }: {
    name: string;
    lastName: string;
    email: string;
    password: string;
    repeatPassword: string;
  }): Promise<void> {
    await this.nameField.fill(name);
    await this.lastNameField.fill(lastName);
    await this.emailField.fill(email);
    await this.passwordField.fill(password);
    await this.repeatPasswordField.fill(repeatPassword);
  }

  async verifyFieldValues({
    name,
    lastName,
    email,
    password,
    repeatPassword,
  }: {
    name: string;
    lastName: string;
    email: string;
    password: string;
    repeatPassword: string;
  }): Promise<void> {
    await expect(this.nameField).toHaveValue(name);
    await expect(this.lastNameField).toHaveValue(lastName);
    await expect(this.emailField).toHaveValue(email);
    await expect(this.passwordField).toHaveValue(password);
    await expect(this.repeatPasswordField).toHaveValue(repeatPassword);
  }

  async verifyErrorMessageVisibility(expectedCount: number): Promise<void> {
    await expect(this.fieldErrorMessage).toHaveCount(expectedCount);
  }

  async verifyFieldErrorMessage(
    field: Locator,
    info: string,
    errorText: string
  ): Promise<void> {
    await this.fillField(field, info);
    await expect(this.fieldErrorMessage).toHaveCount(1);
    await expect(this.fieldErrorMessage).toHaveText(errorText);
  }

  async verifyInvalidEmail(email: string): Promise<void> {
    await this.fillField(this.emailField, email);
    await this.verifyErrorMessageVisibility(1);
    await expect(this.fieldErrorMessage).toHaveText("Email is incorrect");
  }

  async verifyInvalidPassword(password: string): Promise<void> {
    await this.fillField(this.passwordField, password);
    await this.verifyErrorMessageVisibility(1);
    await expect(this.fieldErrorMessage).toHaveText(
      "Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter"
    );
  }
}
