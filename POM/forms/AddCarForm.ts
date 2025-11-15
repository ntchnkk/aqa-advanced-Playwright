import { Locator } from "@playwright/test";
import BasePage from "../Pages/BasePage";

export default class AddCarForm extends BasePage {
  private readonly brandDropdown: Locator = this.page.locator(
    '//select[@id="addCarBrand"]'
  );
  private readonly modelDropdown: Locator = this.page.locator(
    '//select[@id="addCarModel"]'
  );
  private readonly mileageField: Locator = this.page.locator(
    '//input[@id="addCarMileage"]'
  );
  private readonly addButton: Locator = this.page.locator(
    '//div[contains(@class, "modal-footer")]//button[@class="btn btn-primary"]'
  );

  async addCar(brand: string, model: string, mileage: string): Promise<void> {
    await this.brandDropdown.selectOption(brand);
    await this.page.waitForTimeout(300);
    await this.modelDropdown.selectOption(model);
    await this.mileageField.fill(mileage);
    await this.addButton.click();
    // await this.page.waitForTimeout(300);
  }

}