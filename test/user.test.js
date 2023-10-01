import supertest from "supertest";
import { web } from "../src/application/web";
import { logger } from "../src/application/logging";
import { createTestUser, getTestUser, removeTestUser } from "./test-util";
import bcrypt from "bcrypt";

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

describe("GET /api/users/current", function(){
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });
  
  it("should can get current user",async () => {
    const result = await supertest(web)
      .get("/api/users/current")
      .set("Authorization", 'test')

      expect(result.status).toBe(200);
      expect(result.body.data.username).toBe("wpangestu");
      expect(result.body.data.name).toBe("Wahyu Pangestu");
  })

  it("should reject if token is valid",async () => {
    const result = await supertest(web)
      .get("/api/users/current")
      .set("Authorization", 'salah')

      expect(result.status).toBe(401);
      expect(result.body.errors).toBeDefined();
  })
});

describe("PATCH /api/users/current", function(){
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should can update user", async()=>{
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization","test")
      .send({
        name: "pangestu",
        password: "rahasialagi"
      });

      expect(result.status).toBe(200);
      expect(result.body.data.username).toBe("wpangestu");
      expect(result.body.data.name).toBe("pangestu");

      const user = await getTestUser();
      expect(await bcrypt.compare("rahasialagi",user.password)).toBe(true);
  });

  it("should can update user name", async()=>{
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization","test")
      .send({
        name: "pangestu",
      });

      expect(result.status).toBe(200);
      expect(result.body.data.username).toBe("wpangestu");
      expect(result.body.data.name).toBe("pangestu");

  });

  it("should can update user password", async()=>{
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization","test")
      .send({
        password: "rahasialagi"
      });

      expect(result.status).toBe(200);
      expect(result.body.data.username).toBe("wpangestu");
      const user = await getTestUser();
      expect(await bcrypt.compare("rahasialagi",user.password)).toBe(true);

  });

  it("should reject if request not valid", async()=>{
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization","salah")
      .send({
        password: "rahasialagi"
      });

      expect(result.status).toBe(401);
  });
});

describe("DELETE /api/users/logout", function(){

  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("shold can logout user",async()=>{
    const result = await supertest(web)
      .delete("/api/users/logout")
      .set("Authorization","test");

      expect(result.status).toBe(200);
      expect(result.body.data).toBe("OK");

      const user = await getTestUser();
      expect(user.token).toBeNull();
  });

  it("reject logout when token is invalid",async()=>{
    const result = await supertest(web)
      .delete("/api/users/logout")
      .set("Authorization","salah");

      expect(result.status).toBe(401);
  });
});