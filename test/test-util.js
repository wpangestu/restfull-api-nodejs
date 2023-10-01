import { prismaClient } from "../src/application/database";
import bcrypt from "bcrypt";

const removeTestUser = async () => {
  await prismaClient.user.deleteMany({
    where: {
      username: "wpangestu",
    },
  });
};

const createTestUser = async () => {
  await prismaClient.user.create({
    data: {
      username: "wpangestu",
      password: await bcrypt.hash("rahasia", 10),
      name: "Wahyu Pangestu",
      token: "test",
    },
  });
};

export { removeTestUser, createTestUser };
