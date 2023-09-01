import supertest from "supertest";
import { web } from "../src/application/web";
import { logger } from "../src/application/logging";
import { createTestUser, removeTestUser } from "./test-util";

describe("POST /api/users", function () {
  afterEach(async () => {
    await removeTestUser();
  });

  it("should can register user", async () => {
    const result = await supertest(web).post("/api/users").send({
      username: "wpangestu",
      password: "rahasia",
      name: "Wahyu Pangestu",
    });
    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("wpangestu");
    expect(result.body.data.name).toBe("Wahyu Pangestu");
    expect(result.body.data.password).toBeUndefined();
  });

  it("should be rejected", async () => {
    const result = await supertest(web).post("/api/users").send({
      username: "",
      password: "",
      name: "",
    });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject when username already registered", async () => {
    let result = await supertest(web).post("/api/users").send({
      username: "wpangestu",
      password: "rahasia",
      name: "Wahyu Pangestu",
    });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("wpangestu");
    expect(result.body.data.name).toBe("Wahyu Pangestu");
    expect(result.body.data.password).toBeUndefined();

    result = await supertest(web).post("/api/users").send({
      username: "wpangestu",
      password: "rahasia",
      name: "Wahyu Pangestu",
    });
    logger.info(result.body);
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe("POST /api/users/login", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("it should can login", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "wpangestu",
      password: "rahasia",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.token).toBeDefined();
    expect(result.body.data.token).not.toBe("test");
  });

  it("it should rejected empty username n password", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "",
      password: "",
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("it should rejected wrong username n password", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "salah",
      password: "salah",
    });

    logger.info(result);
    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
    expect(result.body.errors).toBe("Username or password wrong");
  });

  it("it should rejected wrong password", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "wpangestu",
      password: "salah",
    });

    logger.info(result);
    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
    expect(result.body.errors).toBe("Username or password wrong");
  });

  it("it should rejected wrong username", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "salah",
      password: "rahasia",
    });

    logger.info(result);
    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
    expect(result.body.errors).toBe("Username or password wrong");
  });
});
