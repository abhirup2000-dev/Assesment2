const Joi = require('joi')



const userRegisterSchemaValidation = Joi.object({
  name: Joi.string().min(4).max(30).required(),
  email: Joi.string().email({minDomainSegments: 2, tlds: { allow: ['com', 'net'] },}),
  role: Joi.string().min(10).max(50).required()
})

const productSchemaValidation = Joi.object({})



module.exports = { userRegisterSchemaValidation, productSchemaValidation}