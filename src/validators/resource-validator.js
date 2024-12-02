const Joi = require('joi');

const tm_resourceSchema = Joi.object({
  Resource_CD: Joi.string().required(),
  Change_CD: Joi.string().allow(null).optional(),
  ResourceG_CD: Joi.string().allow(null).optional(),
  CostG_CD: Joi.string().allow(null).optional(),
  ManageG_CD: Joi.string().allow(null).optional(),
  Resource_Name: Joi.string().allow(null).optional(),
  Resource_Abb: Joi.string().allow(null).optional(),
  Resource_Symbol: Joi.string().allow(null).optional(),
  Resource_Mark: Joi.string().allow(null).optional(),
  Use: Joi.string().allow(null).optional(),
  End: Joi.string().allow(null).optional(),
  M_Coefficient: Joi.string().allow(null).optional(),
  P_Coefficient: Joi.number().allow(null).optional(),
  Before: Joi.number().allow(null).optional(),
  After: Joi.number().allow(null).optional(),
  T_Type: Joi.string().allow(null).optional(),
  P_Type: Joi.string().allow(null).optional(),
  Resource_Remark: Joi.string().allow(null).optional()
});

module.exports = { tm_resourceSchema };
