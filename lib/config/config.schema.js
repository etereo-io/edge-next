import Joi from '@hapi/joi'

export default Joi.object({
    firebase: Joi.object()
      .required(),

    language: Joi.string()
})