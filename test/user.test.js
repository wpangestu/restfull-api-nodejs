import supertest from "supertest";
import { web } from "../src/application/web";
import { prismaClient } from "../src/application/database";
import { logger } from "../src/application/logging";

describe("POST /api/users", function () {
  afterEach(async () => {
    await prismaClient.user.deleteMany({
      where: {
        username: "wpangestu",
      },
    });
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
