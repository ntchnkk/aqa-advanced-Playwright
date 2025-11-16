import { test, expect } from "@playwright/test";

test.describe("Sign up form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page
      .locator(
        "//button[contains(@class, 'hero-descriptor_btn') and contains(@class, 'btn-primary')]"
      )
      .click();
  });

  test.describe("UI and Initial State", () => {
    test("Sign up form opens and is visible", async ({ page }) => {
      await expect(page.locator("//app-signup-modal")).toBeVisible();
    });

    test("All elements on the form are visible", async ({ page }) => {
      await expect(page.locator("//h4[text()='Registration']")).toBeVisible();
      await expect(page.locator("//button[@class='close']")).toBeVisible();
      await expect(page.locator("//input[@id='signupName']")).toBeVisible();
      await expect(page.locator("//input[@id='signupLastName']")).toBeVisible();
      await expect(page.locator("//input[@id='signupEmail']")).toBeVisible();
      await expect(page.locator("//input[@id='signupPassword']")).toBeVisible();
      await expect(
        page.locator("//input[@id='signupRepeatPassword']")
      ).toBeVisible();
    });

    test("Register button is visible and disabled by default", async ({
      page,
    }) => {
      await expect(
        page.getByRole("button", { name: "Register" })
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Register" })
      ).toBeDisabled();
    });

    test("All fields are empty when the form opens", async ({ page }) => {
      const fields = [
        "//input[@id='signupName']",
        "//input[@id='signupLastName']",
        "//input[@id='signupEmail']",
        "//input[@id='signupPassword']",
        "//input[@id='signupRepeatPassword']",
      ];
      for (const field of fields) {
        await expect(page.locator(field)).toHaveValue("");
      }
    });

    test("No errors for input fields by default", async ({ page }) => {
      const fields = [
        "//input[@id='signupName']",
        "//input[@id='signupLastName']",
        "//input[@id='signupEmail']",
        "//input[@id='signupPassword']",
        "//input[@id='signupRepeatPassword']",
      ];

      for (const field of fields) {
        await expect(page.locator(`${field}`)).not.toHaveClass(/is-invalid/);
        await expect(page.locator(`${field}`)).not.toHaveCSS(
          "border-color",
          "rgb(220, 53, 69)"
        );
      }

      await expect(
        page.locator('//div[@class="invalid-feedback"]/p')
      ).toHaveCount(0);
      await expect(
        page.locator(
          '//p[contains(@class,"alert-danger") and text()="User already exists"]'
        )
      ).toHaveCount(0);
    });
  });

  test.describe("Behavior and Interaction", () => {
    test("Register button becomes enabled only when all fields are valid", async ({
      page,
    }) => {
      await page.locator("//input[@id='signupName']").fill("Rina");
      await page.locator("//input[@id='signupLastName']").fill("AQA");
      await page
        .locator("//input[@id='signupEmail']")
        .fill(`aqa-rina.n.qa+${Date.now()}@gmail.com`);
      await page.locator("//input[@id='signupPassword']").fill("123Aq!@#$%^&*");
      await page
        .locator("//input[@id='signupRepeatPassword']")
        .fill("123Aq!@#$%^&*");
      await expect(
        page.getByRole("button", { name: "Register" })
      ).toBeEnabled();
    });

    test("Register button is disabled when at least one field is not valid", async ({
      page,
    }) => {
      const fields = [
        "//input[@id='signupName']",
        "//input[@id='signupLastName']",
        "//input[@id='signupEmail']",
        "//input[@id='signupPassword']",
        "//input[@id='signupRepeatPassword']",
      ];
      const randomField = fields[Math.floor(Math.random() * fields.length)];

      await page.locator("//input[@id='signupName']").fill("Aa".repeat(10));
      await page.locator("//input[@id='signupLastName']").fill("Bb".repeat(10));
      await page
        .locator("//input[@id='signupEmail']")
        .fill(`aqa-rina.n.qa+${Date.now()}@gmail.com`);
      await page.locator("//input[@id='signupPassword']").fill("ValidPa1");
      await page
        .locator("//input[@id='signupRepeatPassword']")
        .fill("ValidPa1");
      await expect(
        page.getByRole("button", { name: "Register" })
      ).toBeEnabled();

      await page.locator(`${randomField}`).clear();
      await expect(
        page.getByRole("button", { name: "Register" })
      ).toBeDisabled();
    });

    test("Error message disappears after correcting invalid input", async ({
      page,
    }) => {
      await page.locator("//input[@id='signupName']").fill("A");
      await page.locator("//input[@id='signupName']").blur();
      await expect(
        page.locator('//div[@class="invalid-feedback"]/p')
      ).toHaveCount(1);
      await page.locator('//input[@id="signupName"]').fill("Kate");
      await page.locator('//input[@id="signupName"]').blur();
      await expect(
        page.locator('//div[@class="invalid-feedback"]/p')
      ).toHaveCount(0);
    });

    test("Sign up form is closed by close icon", async ({ page }) => {
      await page.locator('//button[@class="close"]').click();
      await expect(page.locator("//app-signup-modal")).not.toBeVisible();
    });

    test("Sign up form is closed by clicking outside", async ({ page }) => {
      await page
        .locator('//ngb-modal-window[contains(@class, "d-block")]')
        .click({ position: { x: 0, y: 0 } });
      await expect(page.locator("//app-signup-modal")).not.toBeVisible();
    });

    test("Sign up form is closed by pressing ESC", async ({ page }) => {
      await page.keyboard.press("Escape");
      await expect(page.locator("//app-signup-modal")).not.toBeVisible();
    });

    test("Form clears all fields after closing and reopening", async ({
      page,
    }) => {
      const date = Date.now();

      await page.locator("//input[@id='signupName']").fill("Norah");
      await expect(page.locator('//input[@id="signupName"]')).toHaveValue(
        "Norah"
      );

      await page.locator("//input[@id='signupLastName']").fill("Leray");
      await expect(page.locator('//input[@id="signupLastName"]')).toHaveValue(
        "Leray"
      );

      await page
        .locator("//input[@id='signupEmail']")
        .fill(`aqa-rina.n.qa+${date}@gmail.com`);
      await expect(page.locator(`//input[@id="signupEmail"]`)).toHaveValue(
        `aqa-rina.n.qa+${date}@gmail.com`
      );

      await page
        .locator("//input[@id='signupPassword']")
        .fill("Password1234567");
      await expect(page.locator('//input[@id="signupPassword"]')).toHaveValue(
        "Password1234567"
      );

      await page
        .locator("//input[@id='signupRepeatPassword']")
        .fill("Password1234567");
      await expect(
        page.locator('//input[@id="signupRepeatPassword"]')
      ).toHaveValue("Password1234567");

      await page.locator("//button[@class='close']").click();
      await expect(page.locator("//app-signup-modal")).toHaveCount(0);

      await page
        .locator(
          "//button[contains(@class, 'hero-descriptor_btn') and contains(@class, 'btn-primary')]"
        )
        .click();

      const fields = [
        "//input[@id='signupName']",
        "//input[@id='signupLastName']",
        "//input[@id='signupEmail']",
        "//input[@id='signupPassword']",
        "//input[@id='signupRepeatPassword']",
      ];
      for (const field of fields) {
        await expect(page.locator(field)).toHaveValue("");
      }
    });

    test("Spaces are trimmed in 'Name' field", async ({ page }) => {
      const nameField = page.locator('//input[@id="signupName"]');
      await nameField.fill("  Kate  ");
      await nameField.blur();
      await expect(nameField).toHaveValue("Kate");
    });

    test("Spaces are trimmed in 'Last name' field", async ({ page }) => {
      const lastNameField = page.locator('//input[@id="signupLastName"]');
      await lastNameField.fill("  Lastname  ");
      await lastNameField.blur();
      await expect(lastNameField).toHaveValue("Lastname");
    });
  });

  test.describe("Positive test cases", () => {
    test("New user is registered with valid data", async ({ page }) => {
      await page.locator("//input[@id='signupName']").fill("Li");
      await page.locator("//input[@id='signupLastName']").fill("Wu");
      await page
        .locator("//input[@id='signupEmail']")
        .fill(`aqa-rina.n.qa+${Date.now()}@gmail.com`);
      await page
        .locator("//input[@id='signupPassword']")
        .fill("ValidPassword12");
      await page
        .locator("//input[@id='signupRepeatPassword']")
        .fill("ValidPassword12");
      await page
        .locator(
          "//button[contains(@class,'btn-primary') and text()='Register']"
        )
        .click();

      await expect(
        page.locator("//button[@id='userNavDropdown']")
      ).toBeVisible();
      await expect(page.locator("//h1")).toHaveText("Garage");

      await page
        .locator(
          "//a[contains(@class,'btn-link') and contains(@class,'text-danger')]"
        )
        .click();
    });
  });

  test.describe("Negative test cases", () => {
    test("User is not registered with already existing email", async ({
      page,
    }) => {
      const email = `aqa-rina.n.qa+${Date.now()}@gmail.com`;

      await page.locator('//input[@id="signupName"]').fill("Anna");
      await page.locator('//input[@id="signupLastName"]').fill("Smith");
      await page.locator('//input[@id="signupEmail"]').fill(email);
      await page.locator('//input[@id="signupPassword"]').fill("123456Vp");
      await page
        .locator('//input[@id="signupRepeatPassword"]')
        .fill("123456Vp");
      await page
        .locator(
          "//button[contains(@class,'btn-primary') and text()='Register']"
        )
        .click();

      await page
        .locator(
          "//a[contains(@class,'btn-link') and contains(@class,'text-danger')]"
        )
        .click();

      await page
        .locator(
          "//button[contains(@class, 'hero-descriptor_btn') and contains(@class, 'btn-primary')]"
        )
        .click();

      await page.locator('//input[@id="signupName"]').fill("Valery");
      await page.locator('//input[@id="signupLastName"]').fill("Frost");
      await page.locator('//input[@id="signupEmail"]').fill(email);
      await page.locator('//input[@id="signupPassword"]').fill("123456Pv");
      await page
        .locator('//input[@id="signupRepeatPassword"]')
        .fill("123456Pv");
      await page
        .locator(
          "//button[contains(@class,'btn-primary') and text()='Register']"
        )
        .click();

      await expect(
        page.locator(
          '//p[contains(@class,"alert-danger") and text()="User already exists"]'
        )
      ).toBeVisible();
    });

    test.describe('Field "Name"', () => {
      test("Error message is shown for empty 'Name' field", async ({
        page,
      }) => {
        const nameField = page.locator('//input[@id="signupName"]');
        const error = page.locator('//div[@class="invalid-feedback"]//p');

        await nameField.focus();
        await nameField.blur();

        await expect(nameField).toHaveClass(/is-invalid/);
        await expect(nameField).toHaveCSS("border-color", "rgb(220, 53, 69)");
        await expect(error).toHaveText("Name required");
        await expect(error).toBeVisible();
      });

      test("Error message is shown for too short name", async ({ page }) => {
        const nameField = page.locator('//input[@id="signupName"]');
        const error = page.locator('//div[@class="invalid-feedback"]//p');

        await nameField.fill("A");
        await nameField.blur();

        await expect(nameField).toHaveClass(/is-invalid/);
        await expect(nameField).toHaveCSS("border-color", "rgb(220, 53, 69)");
        await expect(error).toBeVisible();
        await expect(error).toHaveText(
          "Name has to be from 2 to 20 characters long"
        );
      });

      test("Error message is shown for too long name", async ({ page }) => {
        const nameField = page.locator('//input[@id="signupName"]');
        const error = page.locator('//div[@class="invalid-feedback"]//p');

        await nameField.fill("W".repeat(21));
        await nameField.blur();

        await expect(nameField).toHaveClass(/is-invalid/);
        await expect(nameField).toHaveCSS("border-color", "rgb(220, 53, 69)");
        await expect(error).toBeVisible();
        await expect(error).toHaveText(
          "Name has to be from 2 to 20 characters long"
        );
      });

      test(`Error message is shown for non-English letters in 'Name' field`, async ({
        page,
      }) => {
        const nameField = page.locator('//input[@id="signupName"]');
        const error = page.locator('//div[@class="invalid-feedback"]//p');

        await nameField.fill("Abigaëlle");
        await nameField.blur();

        await expect(nameField).toHaveClass(/is-invalid/);
        await expect(nameField).toHaveCSS("border-color", "rgb(220, 53, 69)");
        await expect(error).toBeVisible();
        await expect(error).toHaveText("Name is invalid");
      });

      test(`Error message is shown for special characters in 'Name' field`, async ({
        page,
      }) => {
        const nameField = page.locator('//input[@id="signupName"]');
        const error = page.locator('//div[@class="invalid-feedback"]//p');

        await nameField.fill("Terry-'!#$");
        await nameField.blur();

        await expect(nameField).toHaveClass(/is-invalid/);
        await expect(nameField).toHaveCSS("border-color", "rgb(220, 53, 69)");
        await expect(error).toBeVisible();
        await expect(error).toHaveText("Name is invalid");
      });

      test(`Error message is shown for numbers in 'Name' field`, async ({
        page,
      }) => {
        const nameField = page.locator('//input[@id="signupName"]');
        const error = page.locator('//div[@class="invalid-feedback"]//p');

        await nameField.fill("666Test");
        await nameField.blur();

        await expect(nameField).toHaveClass(/is-invalid/);
        await expect(nameField).toHaveCSS("border-color", "rgb(220, 53, 69)");
        await expect(error).toBeVisible();
        await expect(error).toHaveText("Name is invalid");
      });

      test("Two error messages are shown for invalid too long name", async ({
        page,
      }) => {
        const nameField = page.locator('//input[@id="signupName"]');
        const error = page.locator('//div[@class="invalid-feedback"]//p');

        await nameField.fill("A                   y");
        await nameField.blur();

        await expect(nameField).toHaveClass(/is-invalid/);
        await expect(nameField).toHaveCSS("border-color", "rgb(220, 53, 69)");

        await expect(error.nth(0)).toBeVisible();
        await expect(error.nth(0)).toHaveText("Name is invalid");

        await expect(error.nth(1)).toBeVisible();
        await expect(error.nth(1)).toHaveText(
          "Name has to be from 2 to 20 characters long"
        );
      });
    });

    test.describe('Field "Last name"', () => {
      test('Error message is shown for empty "Last name" field', async ({
        page,
      }) => {
        const lastNameField = page.locator("//input[@id='signupLastName']");
        const error = page.locator('//div[@class="invalid-feedback"]//p');

        await lastNameField.focus();
        await lastNameField.blur();

        await expect(lastNameField).toHaveClass(/is-invalid/);
        await expect(lastNameField).toHaveCSS(
          "border-color",
          "rgb(220, 53, 69)"
        );
        await expect(error).toBeVisible();
        await expect(error).toHaveText("Last name required");
      });

      test("Error message is shown for too short last name", async ({
        page,
      }) => {
        const lastNameField = page.locator("//input[@id='signupLastName']");
        const error = page.locator('//div[@class="invalid-feedback"]//p');

        await lastNameField.fill("l");
        await lastNameField.blur();

        await expect(lastNameField).toHaveClass(/is-invalid/);
        await expect(lastNameField).toHaveCSS(
          "border-color",
          "rgb(220, 53, 69)"
        );
        await expect(error).toBeVisible();
        await expect(error).toHaveText(
          "Last name has to be from 2 to 20 characters long"
        );
      });

      test("Error message is shown for too long last name", async ({
        page,
      }) => {
        const lastNameField = page.locator("//input[@id='signupLastName']");
        const error = page.locator('//div[@class="invalid-feedback"]//p');

        await lastNameField.fill("W".repeat(21));
        await lastNameField.blur();

        await expect(lastNameField).toHaveClass(/is-invalid/);
        await expect(lastNameField).toHaveCSS(
          "border-color",
          "rgb(220, 53, 69)"
        );
        await expect(error).toBeVisible();
        await expect(error).toHaveText(
          "Last name has to be from 2 to 20 characters long"
        );
      });

      test(`Error message is shown for non-English letters in 'Last name' field`, async ({
        page,
      }) => {
        const lastNameField = page.locator("//input[@id='signupLastName']");
        const error = page.locator('//div[@class="invalid-feedback"]//p');

        await lastNameField.fill("Krüger");
        await lastNameField.blur();

        await expect(lastNameField).toHaveClass(/is-invalid/);
        await expect(lastNameField).toHaveCSS(
          "border-color",
          "rgb(220, 53, 69)"
        );
        await expect(error).toBeVisible();
        await expect(error).toHaveText("Last name is invalid");
      });

      test(`Error message is shown for special characters in 'Last name' field`, async ({
        page,
      }) => {
        const lastNameField = page.locator("//input[@id='signupLastName']");
        const error = page.locator('//div[@class="invalid-feedback"]//p');

        await lastNameField.fill("O'Henry-Kruz");
        await lastNameField.blur();

        await expect(lastNameField).toHaveClass(/is-invalid/);
        await expect(lastNameField).toHaveCSS(
          "border-color",
          "rgb(220, 53, 69)"
        );
        await expect(error).toBeVisible();
        await expect(error).toHaveText("Last name is invalid");
      });

      test(`Error message is shown for numbers in 'Last name' field`, async ({
        page,
      }) => {
        const lastNameField = page.locator("//input[@id='signupLastName']");
        const error = page.locator('//div[@class="invalid-feedback"]//p');

        await lastNameField.fill("Lastname2");
        await lastNameField.blur();

        await expect(lastNameField).toHaveClass(/is-invalid/);
        await expect(lastNameField).toHaveCSS(
          "border-color",
          "rgb(220, 53, 69)"
        );
        await expect(error).toBeVisible();
        await expect(error).toHaveText("Last name is invalid");
      });

      test("Two error messages are shown for invalid too long last name", async ({
        page,
      }) => {
        const lastNameField = page.locator("//input[@id='signupLastName']");
        const error = page.locator('//div[@class="invalid-feedback"]//p');

        await lastNameField.fill("Spencer-Churchill-Douglas");
        await lastNameField.blur();

        await expect(lastNameField).toHaveClass(/is-invalid/);
        await expect(lastNameField).toHaveCSS(
          "border-color",
          "rgb(220, 53, 69)"
        );

        await expect(error.nth(0)).toBeVisible();
        await expect(error.nth(0)).toHaveText("Last name is invalid");

        await expect(error.nth(1)).toBeVisible();
        await expect(error.nth(1)).toHaveText(
          "Last name has to be from 2 to 20 characters long"
        );
      });
    });

    test.describe('Field "Email"', () => {
      test('Error message is shown for empty "Email" field', async ({
        page,
      }) => {
        const emailField = page.locator("//input[@id='signupEmail']");
        const error = page.locator('//div[@class="invalid-feedback"]//p');

        await emailField.focus();
        await emailField.blur();

        await expect(emailField).toHaveClass(/is-invalid/);
        await expect(emailField).toHaveCSS("border-color", "rgb(220, 53, 69)");
        await expect(error).toBeVisible();
        await expect(error).toHaveText("Email required");
      });

      const invalidEmails = [
        "invalidemail",
        "testemail.com",
        "TestUser1@",
        "@gmail.com",
        "user@@gmail.com",
        "user test@gmail.com",
        "usertest.@gmail.com",
        "usertest@gmailcom",
      ];

      for (const email of invalidEmails) {
        test(`Error message is shown for invalid email format: ${email}`, async ({
          page,
        }) => {
          const emailField = page.locator("//input[@id='signupEmail']");
          const error = page.locator('//div[@class="invalid-feedback"]//p');

          await emailField.fill(email);
          await emailField.blur();

          await expect(emailField).toHaveClass(/is-invalid/);
          await expect(emailField).toHaveCSS(
            "border-color",
            "rgb(220, 53, 69)"
          );
          await expect(error).toBeVisible();
          await expect(error).toHaveText("Email is incorrect");
        });
      }
    });

    test.describe('Field "Password"', () => {
      test('Error message is shown for empty "Password" field', async ({
        page,
      }) => {
        const passwordField = page.locator("//input[@id='signupPassword']");
        const error = page.locator('//div[@class="invalid-feedback"]//p');

        await passwordField.focus();
        await passwordField.blur();

        await expect(passwordField).toHaveClass(/is-invalid/);
        await expect(passwordField).toHaveCSS(
          "border-color",
          "rgb(220, 53, 69)"
        );
        await expect(error).toBeVisible();
        await expect(error).toHaveText("Password required");
      });

      test("Error message is shown for too short password", async ({
        page,
      }) => {
        const passwordField = page.locator("//input[@id='signupPassword']");
        const error = page.locator('//div[@class="invalid-feedback"]//p');

        await passwordField.fill("12345Pw");
        await passwordField.blur();

        await expect(passwordField).toHaveClass(/is-invalid/);
        await expect(passwordField).toHaveCSS(
          "border-color",
          "rgb(220, 53, 69)"
        );
        await expect(error).toBeVisible();
        await expect(error).toHaveText(
          "Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter"
        );
      });

      test("Error message is shown for too long password", async ({ page }) => {
        const passwordField = page.locator("//input[@id='signupPassword']");
        const error = page.locator('//div[@class="invalid-feedback"]//p');

        await passwordField.fill("Aa92".repeat(4));
        await passwordField.blur();

        await expect(passwordField).toHaveClass(/is-invalid/);
        await expect(passwordField).toHaveCSS(
          "border-color",
          "rgb(220, 53, 69)"
        );
        await expect(error).toBeVisible();
        await expect(error).toHaveText(
          "Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter"
        );
      });

      test("Error message is shown for password with no uppercase letter", async ({
        page,
      }) => {
        const passwordField = page.locator("//input[@id='signupPassword']");
        const error = page.locator('//div[@class="invalid-feedback"]//p');

        await passwordField.fill("password123456");
        await passwordField.blur();

        await expect(passwordField).toHaveClass(/is-invalid/);
        await expect(passwordField).toHaveCSS(
          "border-color",
          "rgb(220, 53, 69)"
        );
        await expect(error).toBeVisible();
        await expect(error).toHaveText(
          "Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter"
        );
      });

      test("Error message is shown for password with no lowercase letter", async ({
        page,
      }) => {
        const passwordField = page.locator("//input[@id='signupPassword']");
        const error = page.locator('//div[@class="invalid-feedback"]//p');

        await passwordField.fill("PASSWORD12");
        await passwordField.blur();

        await expect(passwordField).toHaveClass(/is-invalid/);
        await expect(passwordField).toHaveCSS(
          "border-color",
          "rgb(220, 53, 69)"
        );
        await expect(error).toBeVisible();
        await expect(error).toHaveText(
          "Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter"
        );
      });

      test("Error message is shown for password with no numbers", async ({
        page,
      }) => {
        const passwordField = page.locator("//input[@id='signupPassword']");
        const error = page.locator('//div[@class="invalid-feedback"]//p');

        await passwordField.fill("Password");
        await passwordField.blur();

        await expect(passwordField).toHaveClass(/is-invalid/);
        await expect(passwordField).toHaveCSS(
          "border-color",
          "rgb(220, 53, 69)"
        );
        await expect(error).toBeVisible();
        await expect(error).toHaveText(
          "Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter"
        );
      });
    });

    test.describe('Field "Repeat Password"', () => {
      test('Error message is shown for empty "Repeat Password" field', async ({
        page,
      }) => {
        const repeatPasswordField = page.locator(
          "//input[@id='signupRepeatPassword']"
        );
        const error = page.locator('//div[@class="invalid-feedback"]//p');

        await repeatPasswordField.focus();
        await repeatPasswordField.blur();

        await expect(repeatPasswordField).toHaveClass(/is-invalid/);
        await expect(repeatPasswordField).toHaveCSS(
          "border-color",
          "rgb(220, 53, 69)"
        );
        await expect(error).toBeVisible();
        await expect(error).toHaveText("Re-enter password required");
      });

      test("Error message is shown for not matching password", async ({
        page,
      }) => {
        const passwordField = page.locator("//input[@id='signupPassword']");
        const repeatPasswordField = page.locator(
          "//input[@id='signupRepeatPassword']"
        );
        const error = page.locator('//div[@class="invalid-feedback"]//p');

        await passwordField.fill("Password12");
        await repeatPasswordField.fill("Password13");
        await repeatPasswordField.blur();

        await expect(repeatPasswordField).toHaveClass(/is-invalid/);
        await expect(repeatPasswordField).toHaveCSS(
          "border-color",
          "rgb(220, 53, 69)"
        );
        await expect(error).toBeVisible();
        await expect(error).toHaveText("Passwords do not match");
      });

      test("Error message is shown for too short re-enter password", async ({
        page,
      }) => {
        const repeatPasswordField = page.locator(
          "//input[@id='signupRepeatPassword']"
        );
        const error = page.locator('//div[@class="invalid-feedback"]//p');

        await repeatPasswordField.fill("12345Pw");
        await repeatPasswordField.blur();

        await expect(repeatPasswordField).toHaveClass(/is-invalid/);
        await expect(repeatPasswordField).toHaveCSS(
          "border-color",
          "rgb(220, 53, 69)"
        );
        await expect(error).toBeVisible();
        await expect(error).toHaveText(
          "Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter"
        );
      });

      test("Error message is shown for too long re-enter password", async ({
        page,
      }) => {
        const repeatPasswordField = page.locator(
          "//input[@id='signupRepeatPassword']"
        );
        const error = page.locator('//div[@class="invalid-feedback"]//p');

        await repeatPasswordField.fill("Aa92".repeat(4));
        await repeatPasswordField.blur();

        await expect(repeatPasswordField).toHaveClass(/is-invalid/);
        await expect(repeatPasswordField).toHaveCSS(
          "border-color",
          "rgb(220, 53, 69)"
        );
        await expect(error).toBeVisible();
        await expect(error).toHaveText(
          "Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter"
        );
      });
    });
  });
});
