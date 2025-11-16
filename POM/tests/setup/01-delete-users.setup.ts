import test from "@playwright/test";
import { testUser1, testUser2 } from "../../test-data/users";
import AccountController from "../../../API/controllers/AccountController";

test.describe("Delete test users via API", () => {
  let accountController: AccountController;

  test.beforeEach(({ request }) => {
    accountController = new AccountController(request);
  });

  const testUsers = [testUser1, testUser2];

  for (const user of testUsers) {
    test(`Delete user: ${user.email}`, async () => {
      const sid = await accountController.signIn(user.email, user.password);
      const response = await accountController.deleteUser(user.email, sid);
      test.expect(response.ok()).toBeTruthy();
    });
  }
});
