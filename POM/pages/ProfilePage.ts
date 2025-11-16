import { expect, Locator } from "@playwright/test";
import BasePage from "../Pages/BasePage";

export default class ProfilePage extends BasePage {
  public readonly profileName: Locator = this.page.locator(
    "//p[contains(@class,'profile_name')]"
  );
}
