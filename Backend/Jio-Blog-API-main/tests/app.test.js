import request from "supertest";
import app from "../app.js";

describe("GET /api/blog", () => {
    it("should return greetings", async () => {
      const res = await request(app).get("/api/blog/");
      expect(res.statusCode).toBe(200);
    });
  });

describe("POST /api/user/login", () => {
    it("should return response 200", async () => {
      const res = await request(app).post("/api/user/login")
      .send({ email: 'user1@gmail.com', password: '123456' });
      expect(res.statusCode).toBe(200);
  });
});


  