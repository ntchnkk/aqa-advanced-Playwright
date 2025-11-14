import { expect, Locator } from "@playwright/test";
import BasePage from "../Pages/BasePage";
import AddCarForm from "../forms/AddCarForm";

export default class GaragePage extends BasePage {
  public readonly garagePageHeader: Locator = this.page.locator("//h1", {
    hasText: "Garage",
  });
  public readonly userProfileDropdown: Locator = this.page.locator(
    "//button[@id='userNavDropdown']"
  );

  private readonly addNewCarButton: Locator = this.page.locator(
    '//button[contains(@class, "btn-primary")]'
  );

  private readonly allAddedCarNames: Locator = this.page.locator(
    '//p[contains(@class,"car_name")]'
  );

  public readonly logOutButton: Locator = this.page.locator(
    "//a[contains(@class,'btn-link') and contains(@class,'text-danger')]"
  );

  public readonly lastCarName: Locator = this.page.locator(".car_name").first();

  public readonly editCarButton: Locator = this.page.locator(
    '//span[contains(@class, "icon-edit")]'
  );

  async open(): Promise<void> {
    await this.page.goto("/panel/garage");
  }

  async openAddCarForm(): Promise<AddCarForm> {
    await this.addNewCarButton.click();
    return new AddCarForm(this.getPage());
  }

  async verifyLastAddedCarName(expectedName: string): Promise<void> {
    await expect(this.allAddedCarNames.first()).toHaveText(expectedName);
  }

  async verifyGaragePageIsOpen(): Promise<void> {
    await expect(this.garagePageHeader).toBeVisible();
    await expect(this.userProfileDropdown).toBeVisible();
  }

  async openEditCarForm(): Promise<void> {
    await this.editCarButton.first().click();
  }
}
