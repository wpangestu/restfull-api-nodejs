import {validate} from "../validation/validation.js";
import {prismaClient} from "../application/database.js";
import {createAddressValidation, getAddressValidation} from "../validation/address-validation.js";
import {ResponseError} from "../error/response-error.js";
import {contactValidation} from "../validation/contact-validation.js";

const createAddress = async (user, contactId, request) => {

    contactId = await checkContact(user,contactId);

    const address = validate(createAddressValidation,request);
    address.contact_id = contactId;

    return prismaClient.address.create({
        data: address,
        select:{
            id:true,
            street:true,
            city:true,
            province:true,
            country:true,
            postal_code:true
        }
    });
}

const checkContact = async (user,contactId)=>{
    contactId = validate(contactValidation,contactId);
    const countContact = await prismaClient.contact.count({
        where:{
            username:user.username,
            id:contactId
        }
    });
    if(countContact !== 1){
        throw new ResponseError(404,"Contact is not found");
    }

    return contactId;
}

const getAddress = async (user,contactId,addressId) =>{
    contactId = await checkContact(user,contactId);
    addressId = validate(getAddressValidation,addressId);

    const address = await prismaClient.address.findFirst({
        where:{
            id:addressId,
            contact_id:contactId
        },
        select:{
            id:true,
            street:true,
            city:true,
            province:true,
            country:true,
            postal_code:true
        }
    });

    if(!address){
        throw new ResponseError(404,"Address is not found");
    }
    return address;
}

export default { createAddress,getAddress }