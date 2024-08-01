const Joi = require("joi");

const studentSchema = Joi.object({
  name: Joi.string().required(),
  age: Joi.number().required(),
  college: Joi.string().required(),
  description: Joi.string().required(),
});

const studentIdSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

const studentPagination = Joi.object({
  page: Joi.number().integer(),
  limit: Joi.number().integer(),
  name: Joi.string().allow('', null),
})

module.exports = {
  studentSchema,
  studentIdSchema,
  studentPagination,
};
