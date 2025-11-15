import { Locator } from "@playwright/test";
import BasePage from "../Pages/BasePage";

export default class RemoveCar extends BasePage {
  private readonly removeButton: Locator = this.page.locator(
    '//button[contains(@class, "btn-danger")]'
  );

  async remove(): Promise<void> {
    await this.removeButton.click();
  }
}
