import { validate } from "../validation/validation.js";
import {contactValidation, createContactValidation, updateContactValidation} from "../validation/contact-validation.js";
import {prismaClient} from "../application/database.js";
import {ResponseError} from "../error/response-error.js";
import {logger} from "../application/logging.js";

const createContact = async (user, request) => {
    const contact = validate(createContactValidation,request);
    contact.username = user.username;

    return prismaClient.contact.create({
        data: contact,
        select:{
            id:true,
            first_name:true,
            last_name:true,
            email:true,
            phone:true
        }
    })
}

const getContact = async (user, request) => {
    const contactId = validate(contactValidation,request);

    const contact = await prismaClient.contact.findFirst({
        where:{
            username:user.username,
            id:contactId
        },
        select:{
            id:true,
            first_name:true,
            last_name:true,
            email:true,
            phone:true
        }
    });

    if(!contact){
        throw new ResponseError(404, "Username or password wrong");
    }
    return contact;
}

const update = async (user, request) => {
    const contact = validate(updateContactValidation,request);
    const username = user.username;

    const countContact = await prismaClient.contact.count({
        where:{
            username:username,
            id:contact.id
        }
    });

    if(countContact!== 1){
        throw new ResponseError(404, "Contact is not found");
    }

    return prismaClient.contact.update({
        where:{
            id:contact.id
        },
        data:{
            first_name:contact.first_name,
            last_name:contact.last_name,
            email:contact.email,
            phone:contact.phone
        },
        select:{
            id:true,
            first_name:true,
            last_name:true,
            email:true,
            phone:true
        }
    });
}

const deleteContact = async (user,request) => {
  const contactId = validate(contactValidation,request);

  const countContact = await prismaClient.contact.count({
      where:{
          username:user.username,
          id:contactId
      }
  });

  if(countContact !== 1){
      throw new ResponseError(404,"Contact is not found");
  }

  return prismaClient.contact.delete({
      where:{
          id:contactId
      }
  });
}

export default {createContact,getContact,update,deleteContact}