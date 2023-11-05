import { validate } from "../validation/validation.js";
import {contactValidation, createContactValidation} from "../validation/contact-validation.js";
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

export default {createContact,getContact}