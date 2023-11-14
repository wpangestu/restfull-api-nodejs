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

const getTestUser = async() => {
  return prismaClient.user.findUnique({
    where:{
      username:"wpangestu"
    }
  });
}

const removeAllTestContact = async ()=>{
  return prismaClient.contact.deleteMany({
    where:{
      username:"wpangestu"
    }
  });
}

const createTestContact = async ()=>{
  return prismaClient.contact.create({
    data:{
      username:"wpangestu",
      first_name: "test",
      last_name: "test",
      email:"test@fakeemail.com",
      phone: "6285229222111"
    }
  })
}

const getTestContact = async ()=> {
  return prismaClient.contact.findFirst({
    where:{
      username:"wpangestu"
    }
  });
}

const createManyTestContacts = async ()=>{
  for (let i= 0; i<15; i++){
    await prismaClient.contact.create({
      data:{
        username:'wpangestu',
        first_name: `test ${i}`,
        last_name: `test ${i}`,
        email: `test${i}@email.com`,
        phone: `628522922211${i}`
      }
    })
  }
}

const removeAllAddress = async ()=>{
  const contact = await getTestContact();
  return prismaClient.address.deleteMany({
    where:{
      contact_id:contact.id
    }
  });
}

const createTesAddress = async ()=>{
  const contact = await getTestContact();
  return prismaClient.address.create({
    data:{
      contact_id:contact.id,
      street:"street test",
      city:"city test",
      postal_code:"12345",
      province:"jawa",
      country:"indo"
    }
  });
}

const getAddress = async () =>{
  const contact = await getTestContact();

  return prismaClient.address.findFirst({
    where:{
      contact_id:contact.id
    }
  });
}

export { removeTestUser, createTestUser, getTestUser, removeAllTestContact, createTestContact, getTestContact, createManyTestContacts, removeAllAddress, getAddress, createTesAddress };
