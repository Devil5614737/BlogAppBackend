const Joi=require('joi');

function Validate(obj){
    const schema=Joi.object({
        username:Joi.string().min(5).max(10).required(),
        email:Joi.string().email().required(),
        password:Joi.string().required(),
        displayPic:Joi.string().required(),
    })

const {error}=schema.validate(obj)
return error
}


module.exports=Validate;