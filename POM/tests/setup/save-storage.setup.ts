import test, { expect } from "@playwright/test";
import HomePage from "../../pages/HomePage";
import SignInForm from "../../forms/SignInForm";
import GaragePage from "../../pages/GaragePage";
import { testUser1 } from "../../test-data/users";

test.describe("Login and save states", () => {
  let homePage: HomePage;
  let signInForm: SignInForm;
  let garagePage: GaragePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    garagePage = new GaragePage(page);

    await homePage.open();
    await homePage.openSignInForm();
  });

  test("Login as testUser1 and save state", async ({ page }) => {
    signInForm = new SignInForm(page);

    await signInForm.loginWithCredentials(testUser1.email, testUser1.password);
    await expect(garagePage.garagePageHeader).toBeVisible();
    await page.context().storageState({ path: ".auth/testUser1.json" });
  });
});
