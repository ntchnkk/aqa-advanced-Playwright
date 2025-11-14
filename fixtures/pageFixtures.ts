import { test as base, BrowserContext, Page } from "@playwright/test";
import GaragePage from "../POM/pages/GaragePage";
import AddCarForm from "../POM/forms/AddCarForm";
import EditCarForm from "../POM/forms/EditCarForm";
import RemoveCar from "../POM/forms/RemoveCar";

type pageFixtures = {
  garagePageAsUser1: GaragePage;
  addCarForm: AddCarForm;
};

export const test = base.extend<pageFixtures>({
  garagePageAsUser1: async ({ browser }, use) => {
    const context: BrowserContext = await browser.newContext({
      storageState: ".auth/testUser1.json",
    });

    let page: Page = await context.newPage();
    let garagePage = new GaragePage(page);
    await garagePage.open();
    await use(garagePage);
    await garagePage.openEditCarForm();
    let editCarForm = new EditCarForm(garagePage.getPage());
    await editCarForm.removeCar();
    let removeCarForm = new RemoveCar(garagePage.getPage());
    await removeCarForm.remove();
    // await garagePage.getPage().waitForTimeout(300);
    await context.close();
  },
  addCarForm: async ({ garagePageAsUser1 }, use) => {
    const form = await garagePageAsUser1.openAddCarForm();
    await use(form);
  },
});

export { expect } from "@playwright/test";
