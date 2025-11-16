import { test, expect } from "../../fixtures/pageFixtures";
import CarsController from "../../API/controllers/CarsController";
import { getSidFromStorageState } from "./setup/04-storageSid";

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
      await garagePageAsUser1.verifyLastAddedCarName("Audi A6");
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

  test.describe("API tests", () => {
    let carsController: CarsController;
    let sid: string;

    test.beforeEach(async ({ request }) => {
      carsController = new CarsController(request);
      sid = await getSidFromStorageState(".auth/testUser1.json");
    });

    test.afterEach(async () => {
      await carsController.removeLastAddedCar(sid);
    });

    test.describe("Positive API tests", () => {
      test("Add new car Ford Fusion [/api/cars/]", async () => {
        const validCarData = { carBrandId: 3, carModelId: 13, mileage: 777 };

        const response = await carsController.addCar(validCarData, sid);
        const body = await response.json();

        expect(response.status()).toBe(201);
        expect(body.data.carBrandId).toBe(validCarData.carBrandId);
        expect(body.data.carModelId).toBe(validCarData.carModelId);
        expect(body.data.mileage).toBe(validCarData.mileage);
        expect(body.data.initialMileage).toBe(validCarData.mileage);
        expect(body.data.brand).toBe("Ford");
      });
    });

    test.describe("Negative API tests", () => {
      test("Add new car with invalid mileage [-/api/cars/]", async () => {
        const invalidCarData = { carBrandId: 3, carModelId: 13, mileage: -100 };

        const response = await carsController.addCar(invalidCarData, sid);
        const body = await response.json();

        expect(response.status()).toBe(400);
        expect(body.message).toBe("Mileage has to be from 0 to 999999");
      });

      test("Add new car with invalid car model [-/api/cars/]", async () => {
        const invalidCarData = { carBrandId: 1, carModelId: 13, mileage: 100 };

        const response = await carsController.addCar(invalidCarData, sid);
        const body = await response.json();

        expect(response.status()).toBe(404);
        expect(body.message).toBe("Model not found");
      });

      test("Add new car with invalid car brand [-/api/cars/]", async () => {
        const invalidCarData = { carBrandId: 0, carModelId: 2, mileage: 100 };

        const response = await carsController.addCar(invalidCarData, sid);
        const body = await response.json();

        expect(response.status()).toBe(404);
        expect(body.message).toBe("Brand not found");
      });

      test("Add new car with user not logged in [-/api/cars/]", async () => {
        const validCarData = { carBrandId: 1, carModelId: 2, mileage: 100 };

        const response = await carsController.addCar(validCarData);
        const body = await response.json();

        expect(response.status()).toBe(401);
        expect(body.message).toBe("Not authenticated");
      });
    });
  });
});
