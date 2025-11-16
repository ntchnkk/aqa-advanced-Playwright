import { APIRequestContext, APIResponse } from "@playwright/test";

export default class CarsController {
  request: APIRequestContext;
  constructor(request: APIRequestContext) {
    this.request = request;
  }

  private authHeader(sid?: string) {
    return sid ? { headers: { 'Cookie': `${sid}` } } : {};
  }

  async addCar(
    carData: { carBrandId: number; carModelId: number; mileage: number },
    sid?: string
  ): Promise<APIResponse> {
    const response = await this.request.post("/api/cars", {
      data: carData,
      ...this.authHeader(sid),
    });
    return response;
  }

  async getAllCars(sid?: string): Promise<APIResponse> {
    const response = await this.request.get("/api/cars", this.authHeader(sid));
    return response;
  }

  async removeCar(carId: number, sid?: string): Promise<APIResponse> {
    const response = await this.request.delete(`/api/cars/${carId}`, this.authHeader(sid));
    return response;
  }

  async removeLastAddedCar(sid?: string): Promise<void> {
    const carsResponse = await this.getAllCars(sid);
    const carsBody = await carsResponse.json();
    const cars = Array.isArray(carsBody?.data) ? carsBody.data : [];
    if (cars.length > 0) {
      await this.removeCar(cars[0].id, sid);
      console.log("Removed last added car:", cars[0].id);
    }
  }
}
