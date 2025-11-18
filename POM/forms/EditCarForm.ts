import { Locator } from "@playwright/test";
import BasePage from "../pages/BasePage";

export default class EditCarForm extends BasePage {
  private readonly removeCarButton: Locator = this.page.getByText("Remove car");

  async removeCar(): Promise<void> {
    await this.removeCarButton.click();
  }
}
