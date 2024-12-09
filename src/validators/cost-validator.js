const Joi = require("joi");

const td_costSchema = Joi.object({
    Order_No: Joi.string().max(20).required(),         
    Parts_No: Joi.string().max(2).required(),           
    Cost_No: Joi.string().max(4).required(),            
    Process_No: Joi.string().max(2).optional().allow(''),         
    OdPt_No: Joi.string().max(22).optional().allow(''),           
    OdPtCs_No: Joi.string().max(26).optional().allow(''),         
    OdPtPr_No: Joi.string().max(24).optional().allow(''),         
    CMC: Joi.string().max(8).optional().allow(''),               
    CMT: Joi.number().integer().optional().allow(null),             
    CPC: Joi.string().max(10).optional().allow(''),
    CPT: Joi.number().integer().optional().allow(null),             
    CPD: Joi.date().optional().allow(null),                         
    CPN: Joi.number().integer().optional().allow(null),
    Cs_Progress_CD: Joi.string().max(2).optional().allow(''),     
    Cs_Complete_Date: Joi.date().optional().allow(null),            
    Cs_Complete_Qty: Joi.number().integer().optional().allow(null), 
    Cs_Label_CSV: Joi.boolean().optional().allow(null),             
    Cs_All_Complete: Joi.boolean().optional().allow(null),          
    Cs_Order_All_Complete: Joi.boolean().optional().allow(null),   
    Cs_Parts_Complete: Joi.boolean().optional().allow(null),
    Cs_Final_Complete: Joi.boolean().optional().allow(null),
    Cs_Remark: Joi.string().max(255).optional().allow(null),
    Cs_Register_Date: Joi.date().optional().allow(null),
    Cs_Modify_Date: Joi.date().optional().allow(null),
    Cs_Reg_Person_CD: Joi.date().optional().allow(null),
    Cs_Upd_Person_CD: Joi.date().optional().allow(null),
    Sequence_No: Joi.number().integer().optional().allow(null)
  });
  
  module.exports = { td_costSchema };