import test from "@playwright/test";
import AccountController from "../../../API/controllers/AccountController";
import { testUser1, testUser2 } from "../../test-data/users";

test.describe("Create test users via API", () => {
  let accountController: AccountController;

  test.beforeEach(({ request }) => {
    accountController = new AccountController(request);
  });

  const testUsers = [testUser1, testUser2];

  for (const user of testUsers) {
    test(`Create user: ${user.email}`, async () => {
      const response = await accountController.registerUser(
        user.email,
        user.password,
        user.firstName || "TestUserFN",
        user.lastName || "TestUserLN"
      );
      console.log(await response.json());
      test.expect(response.ok()).toBeTruthy();
    });
  }
});
