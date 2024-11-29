const Joi = require('joi');

const tm_vendorSchema = Joi.object({
    Vendor_CD: Joi.string().required(),
    Vendor_Name: Joi.string().allow(null).optional(),
    Vendor_Name2: Joi.string().allow(null).optional(),
    Vendor_Abb: Joi.string().allow(null).optional(),
    Vendor_Add: Joi.string().allow(null).optional(),
    Vendor_Add2: Joi.string().allow(null).optional(),
    Vendor_Add3: Joi.string().allow(null).optional(),
    Vendor_Contact: Joi.string().allow(null).optional(),
    Vendor_TEL: Joi.string().allow(null).optional(),
    Posting_Group: Joi.string().allow(null).optional(),
    Payment_CD: Joi.string().allow(null).optional(),
    Blocked: Joi.boolean().allow(null).optional(),
    VAT_Reg_No: Joi.string().allow(null).optional(),
    Branch_No: Joi.string().allow(null).optional(),
    Nationality: Joi.string().allow(null).optional(),
    Vendor_Group: Joi.string().allow(null).optional(),
    Vendor_Remark: Joi.string().allow(null).optional(),
});

module.exports = { tm_vendorSchema };