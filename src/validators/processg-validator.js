const Joi = require('joi');

const tm_processgSchema = Joi.object({
    ProcessG_CD: Joi.string().required(),
    Change_CD: Joi.string().allow(null).optional(),
    ManageG_CD: Joi.string().allow(null).optional(),
    ProcessG_Name: Joi.string().allow(null).optional(),
    ProcessG_Abb: Joi.string().allow(null).optional(),
    ProcessG_Symbol: Joi.string().allow(null).optional(),
    ProcessG_Mark: Joi.string().allow(null).optional(),
    Use: Joi.string().allow(null).optional(),
    Use_Object: Joi.string().allow(null).optional(),
    Graph: Joi.string().allow(null).optional(),
    List: Joi.string().allow(null).optional(),
    Coefficient: Joi.string().allow(null).optional(),
    M_Coefficient: Joi.string().allow(null).optional(),
    P_Coefficient: Joi.string().allow(null).optional(),
    Std_M_CAT: Joi.string().allow(null).optional(),
    Std_M_Time: Joi.number().allow(null).optional(),
    Std_P_CAT: Joi.number().allow(null).optional(),
    Std_P_Time: Joi.number().allow(null).optional(),
    M_Resource_N: Joi.number().allow(null).optional(),
    S_Resource_N: Joi.number().allow(null).optional(),
    ProcessG_Remark: Joi.string().allow(null).optional(),
});

module.exports = { tm_processgSchema };