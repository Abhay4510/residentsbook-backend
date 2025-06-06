const Joi = require("joi");

const createResidentValidation = (data) => {
  const schema = Joi.object({
    firstName: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .required()
      .messages({
        "string.empty": "First name is required",
        "string.min": "First name must be at least 2 characters long",
        "string.max": "First name cannot exceed 50 characters",
        "any.required": "First name is required",
      }),
    
    lastName: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .required()
      .messages({
        "string.empty": "Last name is required",
        "string.min": "Last name must be at least 2 characters long",
        "string.max": "Last name cannot exceed 50 characters",
        "any.required": "Last name is required",
      }),
    
    title: Joi.string()
      .trim()
      .min(2)
      .max(1000)
      .required()
      .messages({
        "string.empty": "Title/Role is required",
        "string.min": "Title must be at least 2 characters long",
        "string.max": "Title cannot exceed 100 characters",
        "any.required": "Title/Role is required",
      }),
    
    linkedIn: Joi.string()
      .trim()
      .uri()
      .pattern(/^https?:\/\/(www\.)?linkedin\.com\//)
      .allow("")
      .optional()
      .messages({
        "string.uri": "Please provide a valid LinkedIn URL",
        "string.pattern.base": "LinkedIn URL must be a valid LinkedIn profile link",
      }),
    
    twitter: Joi.string()
      .trim()
      .uri()
      .pattern(/^https?:\/\/(www\.)?(twitter\.com|x\.com)\//)
      .allow("")
      .optional()
      .messages({
        "string.uri": "Please provide a valid Twitter/X URL",
        "string.pattern.base": "Twitter URL must be a valid Twitter or X profile link",
      }),
  });

  return schema.validate(data, { abortEarly: false });
};

const updateResidentValidation = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().trim().min(2).max(50).optional(),
    lastName: Joi.string().trim().min(2).max(50).optional(),
    title: Joi.string().trim().min(2).max(100).optional(),
    linkedIn: Joi.string()
      .trim()
      .uri()
      .pattern(/^https?:\/\/(www\.)?linkedin\.com\//)
      .allow("")
      .optional(),
    twitter: Joi.string()
      .trim()
      .uri()
      .pattern(/^https?:\/\/(www\.)?(twitter\.com|x\.com)\//)
      .allow("")
      .optional(),
  });

  return schema.validate(data, { abortEarly: false });
};

module.exports = {
  createResidentValidation,
  updateResidentValidation,
};