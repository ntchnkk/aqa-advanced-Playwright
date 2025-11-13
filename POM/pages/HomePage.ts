import { Locator } from "@playwright/test";
import BasePage from "./BasePage";

export default class HomePage extends BasePage {
  private readonly signUpButton: Locator = this.page.locator(
    "//button[contains(@class, 'hero-descriptor_btn') and contains(@class, 'btn-primary')]"
  );

  async open(): Promise<void> {
    await this.page.goto("/");
  }

  async clickSignUpButton(): Promise<void> {
    await this.signUpButton.click();
  }
}
