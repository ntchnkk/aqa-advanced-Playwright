import { test, expect } from "../../fixtures/pageFixtures";

test.describe("POM Garage Page tests", () => {
  test.describe("Successful car adding", () => {
    test("Add Audi Q7", async ({ garagePageAsUser1, addCarForm }) => {
      await addCarForm.addCar("Audi", "Q7", "555");
      await garagePageAsUser1.verifyLastAddedCarName("Audi Q7");
    });

    test("Add BMW X5 to Garage", async ({ garagePageAsUser1, addCarForm }) => {
      await addCarForm.addCar("BMW", "X5", "333");
      await garagePageAsUser1.verifyLastAddedCarName("BMW X5");
    });

    test("Add Porsche Panamera to Garage", async ({
      garagePageAsUser1,
      addCarForm,
    }) => {
      await addCarForm.addCar("Porsche", "Panamera", "333");
      await garagePageAsUser1.verifyLastAddedCarName("Porsche Panamera");
    });

    test("Add Audi A6 to Garage", async ({ garagePageAsUser1, addCarForm }) => {
      await addCarForm.addCar("Audi", "A6", "333");
      await garagePageAsUser1.verifyLastAddedCarName("Audi  A6");
    });

    test("Add Audi R8 to Garage", async ({ garagePageAsUser1, addCarForm }) => {
      await addCarForm.addCar("Audi", "R8", "5555");
      await garagePageAsUser1.verifyLastAddedCarName("Audi R8");
    });

    test("Add Fiat Panda to Garage", async ({
      garagePageAsUser1,
      addCarForm,
    }) => {
      await addCarForm.addCar("Fiat", "Panda", "444");
      await garagePageAsUser1.verifyLastAddedCarName("Fiat Panda");
    });
  });
});
