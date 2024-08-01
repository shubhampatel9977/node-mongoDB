const Joi = require("joi");

const teacherSchema = Joi.object({
  name: Joi.string().required(),
  age: Joi.number().required(),
  college: Joi.string().required(),
  description: Joi.string().required(),
});

const teacherIdSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

const teacherPagination = Joi.object({
  page: Joi.number().integer(),
  limit: Joi.number().integer(),
  name: Joi.string().allow('', null),
})

module.exports = {
  teacherSchema,
  teacherIdSchema,
  teacherPagination,
};
