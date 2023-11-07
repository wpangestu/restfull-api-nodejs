import contactService from "../service/contact-service.js";

const create = async (req,res,next) =>{
    try{
        const user = req.user;
        const request = req.body;
        const result = await contactService.createContact(user,request);
        res.status(200).json({
            data:result
        });
    }catch (e){
        next(e)
    }
}

const get = async (req,res,next)=>{
    try {
        const user = req.user;
        const contactId = req.params.contactId;

        const result = await contactService.getContact(user,contactId);

        res.status(200).json({
            data:result
        });
    }catch (e) {
        next(e)
    }
}

const update = async (req,res,next) => {
    try{
        const user = req.user;
        const contact = req.body;
        const contactId = req.params.contactId;
        contact.id = contactId;

        const result = await contactService.update(user,contact);

        res.status(200).json({
            data:result
        });

    }catch (e) {
        next(e)
    }
}

const remove = async (req,res,next)=>{
    try {
        const user = req.user;
        const contactId = req.params.contactId;

        const result = await contactService.deleteContact(user,contactId);

        res.status(200).json({
            data:"OK"
        });
    }catch (e) {
        next(e);
    }
}

export default { create, get, update, remove }