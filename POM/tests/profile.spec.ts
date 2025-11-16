import { test, expect } from "@playwright/test";
import ProfilePage from "../pages/ProfilePage";

let profilePage: ProfilePage;

test.use({ storageState: ".auth/testUser1.json" });

test.describe("Profile Page", () => {

  test.beforeEach(async ({ page }) => {
    profilePage = new ProfilePage(page);
  });

  test("Profile page shows mocked user data", async ({ page }) => {
    const mockedProfile = {
      status: "ok",
      data: {
        userId: 999999,
        photoFilename: "default-user.png",
        name: "Mocked FN",
        lastName: "Mocked LN",
      },
    };

    await page.route(
      "/api/users/profile",
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(mockedProfile),
        });
      }
    );

    await page.goto("/panel/profile");

    await expect(profilePage.profileName).toHaveText(
      `${mockedProfile.data.name} ${mockedProfile.data.lastName}`
    );
  });
});
