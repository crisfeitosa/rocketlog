import request from "supertest";

import { app } from "@/app";

describe("UserController", () => {
  it("should create a new user successfully", async () => {
    const response = await request(app).post("/users").send({
      name: "Joe Smith",
      email: "tqjYB@example.com",
      password: "password123"
    })

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe("Joe Smith");
  });
});
