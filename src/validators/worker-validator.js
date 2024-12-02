const Joi = require('joi');

const tm_workerSchema = Joi.object({
    Worker_CD: Joi.string().required(),
    Worker_Pass: Joi.string().allow(null).optional(),
    WorkerG_CD: Joi.string().allow(null).optional(),
    WorkG_CD: Joi.string().allow(null).optional(),
    Worker_Name: Joi.string().allow(null).optional(),
    Worker_Abb: Joi.string().allow(null).optional(),
    Worker_JPN: Joi.string().allow(null).optional(),
    Access_Lv: Joi.number().integer().allow(null).optional(),
    Worker_Level: Joi.string().allow(null).optional(),
    Worker_Menu: Joi.string().allow(null).optional(),
    Worker_Remark: Joi.string().allow(null).optional(),
});

module.exports = { tm_workerSchema };