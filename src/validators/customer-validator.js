const Joi = require('joi');

const tm_customerSchema = Joi.object({
    Customer_CD: Joi.string().required(),
    Customer_Name: Joi.string().allow(null).optional(),
    Customer_Name2: Joi.string().allow(null).optional(),
    Customer_Abb: Joi.string().allow(null).optional(),
    Customer_Add: Joi.string().allow(null).optional(),
    Customer_Add2: Joi.string().allow(null).optional(),
    Customer_Add3: Joi.string().allow(null).optional(),
    Customer_Contact: Joi.string().allow(null).optional(),
    Customer_TEL: Joi.string().allow(null).optional(),
    Posting_Group: Joi.string().allow(null).optional(),
    Payment_CD: Joi.string().allow(null).optional(),
    Sl_Person_CD: Joi.string().allow(null).optional(),
    Blocked: Joi.boolean().allow(null).optional(),
    Customer_FAX: Joi.string().allow(null).optional(),
    Branch_No: Joi.string().allow(null).optional(),
    Nationality: Joi.string().allow(null).optional(),
    Customer_Group: Joi.string().allow(null).optional(),
    VAT_Reg_No: Joi.string().allow(null).optional(),
    Customer_Remark: Joi.string().allow(null).optional(),
});

module.exports = { tm_customerSchema };