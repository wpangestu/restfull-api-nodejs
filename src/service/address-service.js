import {validate} from "../validation/validation.js";
import {prismaClient} from "../application/database.js";
import {
    createAddressValidation,
    getAddressValidation,
    updateAddressValidation
} from "../validation/address-validation.js";
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

const updateAddress = async (user,contactId,req) => {
    contactId = await checkContact(user,contactId);

    const address = validate(updateAddressValidation,req);

    const totalAddressInDatabase = await prismaClient.address.count({
        where:{
            contact_id:contactId,
            id:address.id
        }
    });

    if(totalAddressInDatabase!==1){
        throw new ResponseError(404, "Address is not found")
    }

    return prismaClient.address.update({
        where:{
            id:address.id
        },
        data:{
            street:address.street,
            city:address.city,
            province:address.province,
            country:address.country,
            postal_code:address.postal_code
        }
    })
}

const remove = async (user,contactId,addressId)=>{
    contactId = await checkContact(user,contactId);

    addressId = validate(getAddressValidation,addressId);

    const totalAddress = await prismaClient.address.count({
        where:{
            id:addressId,
            contact_id:contactId
        }
    });

    if(totalAddress!==1){
        throw new ResponseError(404,"address is not found");
    }

    return prismaClient.address.delete({
        where:{
            id:addressId
        }
    });
}

const list = async (user,contactId)=>{
    contactId = await checkContact(user,contactId);

    return prismaClient.address.findMany({
        where:{
            contact_id:contactId
        },
        select:{
            id:true,
            street:true,
            country:true,
            city:true,
            postal_code:true,
            province:true
        }
    });
}

export default { createAddress,getAddress, updateAddress, remove, list }