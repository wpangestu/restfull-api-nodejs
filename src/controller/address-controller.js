import addressService from "../service/address-service.js";
import {logger} from "../application/logging.js";

const create = async(req,res,next)=>{
    try {
        const user = req.user;
        const contactId = req.params.contactId;
        const request = req.body;

        const result = await addressService.createAddress(user,contactId,request);

        res.status(200).json({
           data:result
        });

    }catch (e) {
        next(e)
    }
}

const get = async (req,res,next)=>{
    try{
        const user = req.user;
        const contactId = req.params.contactId;
        const addressId = req.params.addressId;

        const result= await addressService.getAddress(user,contactId,addressId);
        res.status(200).json({
            data:result
        });
    }catch (e) {
        next(e)
    }
}

export default {create,get}