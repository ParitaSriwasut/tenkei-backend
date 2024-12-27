const Joi = require('joi');

const td_orderSchema = Joi.object({
    Order_No: Joi.string().required(), // ฟิลด์จำเป็น
    Product_Grp_CD: Joi.string().allow(null, '').optional(),
    Customer_CD: Joi.string().allow(null, '').optional(),
    NAV_Name: Joi.string().allow(null, '').optional(),
    Product_Name: Joi.string().allow(null, '').optional(),
    NAV_Size: Joi.string().allow(null, '').optional(),
    Product_Size: Joi.string().allow(null, '').optional(),
    Tolerance: Joi.string().allow(null, '').optional(),
    Customer_Draw: Joi.string().allow(null, '').optional(),
    Company_Draw: Joi.string().allow(null, '').optional(),
    Product_Draw: Joi.string().allow(null, '').optional(),
    Quantity: Joi.number().integer().allow(null).optional(),
    Pd_Target_Qty: Joi.number().integer().allow(null).optional(),
    Pd_Complete_Qty: Joi.number().integer().allow(null).optional(),
    I_Complete_Qty: Joi.number().integer().allow(null).optional(),
    Shipment_Qty: Joi.number().integer().allow(null).optional(),
    Pd_Split_Qty: Joi.number().integer().allow(null).optional(),
    Pd_Calc_Qty: Joi.number().integer().allow(null).optional(),
    NG_Qty: Joi.number().integer().allow(null).optional(),
    Unit_CD: Joi.string().allow(null, '').optional(),
    Sales_Grp_CD: Joi.string().allow(null, '').optional(),
    Sales_Person_CD: Joi.string().allow(null, '').optional(),
    Request1_CD: Joi.string().allow(null, '').optional(),
    Request2_CD: Joi.string().allow(null, '').optional(),
    Request3_CD: Joi.string().allow(null, '').optional(),
    Material1: Joi.string().allow(null, '').optional(),
    H_Treatment1: Joi.string().allow(null, '').optional(),
    Material2: Joi.string().allow(null, '').optional(),
    H_Treatment2: Joi.string().allow(null, '').optional(),
    Material3: Joi.string().allow(null, '').optional(),
    H_Treatment3: Joi.string().allow(null, '').optional(),
    Material4: Joi.string().allow(null, '').optional(),
    H_Treatment4: Joi.string().allow(null, '').optional(),
    Material5: Joi.string().allow(null, '').optional(),
    H_Treatment5: Joi.string().allow(null, '').optional(),
    Coating_CD: Joi.string().allow(null, '').optional(),
    Coating: Joi.string().allow(null, '').optional(),
    Quote_No: Joi.string().allow(null, '').optional(),
    Quote_CD: Joi.string().allow(null, '').optional(),
    Od_No_of_Pd_Split: Joi.string().allow(null, '').optional(),
    Item0_CD: Joi.string().allow(null, '').optional(),
    Item1_CD: Joi.string().allow(null, '').optional(),
    Item2_CD: Joi.string().allow(null, '').optional(),
    Item3_CD: Joi.string().allow(null, '').optional(),
    Item4_CD: Joi.string().allow(null, '').optional(),
    Custom_Material: Joi.string().allow(null, '').optional(),
    Od_No_of_Custom: Joi.string().allow(null, '').optional(),
    Supply_CD: Joi.string().allow(null, '').optional(),
    Destination_CD: Joi.string().allow(null, '').optional(),
    Contract_Docu_CD: Joi.string().allow(null, '').optional(),
    Price_CD: Joi.string().allow(null, '').optional(),
    Unit_Price: Joi.number().precision(2).allow(null).optional(),
    Od_Progress_CD: Joi.string().allow(null, '').optional(),
    Specific_CD: Joi.string().allow(null, '').optional(),
    Delivery_CD: Joi.string().allow(null, '').optional(),
    Schedule_CD: Joi.string().allow(null, '').optional(),
    Target_CD: Joi.string().allow(null, '').optional(),
    Product_Docu: Joi.string().allow(null, '').optional(),
    Procure_Docu: Joi.string().allow(null, '').optional(),
    Outside_Docu: Joi.string().allow(null, '').optional(),
    Inspect_Docu: Joi.string().allow(null, '').optional(),
    Send_Docu: Joi.string().allow(null, '').optional(),
    Supple_Docu: Joi.string().allow(null, '').optional(),
    Sl_Instructions: Joi.string().allow(null, '').optional(),
    Pd_Instructions: Joi.string().allow(null, '').optional(),
    Pd_Remark: Joi.string().allow(null, '').optional(),
    I_Remark: Joi.string().allow(null, '').optional(),
    Od_Ctl_Person_CD: Joi.string().allow(null, '').optional(),
    Od_Reg_Person_CD: Joi.string().allow(null, '').optional(),
    Od_Upd_Person_CD: Joi.string().allow(null, '').optional(),
    Request_Delivery: Joi.date().allow(null).optional(), // วันที่
    Product_Delivery: Joi.date().allow(null).optional(), // วันที่
    Confirm_Delivery: Joi.date().allow(null).optional(), // วันที่
    NAV_Delivery: Joi.date().allow(null).optional(), // วันที่
    ASP_Delivery: Joi.date().allow(null).optional(), // วันที่
    Order_Date: Joi.date().allow(null).optional(), // วันที่
    Pd_Received_Date: Joi.date().allow(null).optional(), // วันที่
    Pd_Complete_Date: Joi.date().allow(null).optional(), // วันที่
    I_Completed_Date: Joi.date().allow(null).optional(), // วันที่
    Shipment_Date: Joi.date().allow(null).optional(), // วันที่
    Pd_Calc_Date: Joi.date().allow(null).optional(), // วันที่
    Calc_Process_Date: Joi.date().allow(null).optional(), // วันที่
    Rs_Confirm_Date: Joi.date().allow(null).optional(), // วันที่
    Od_Reg_Date: Joi.date().allow(null).optional(), // วันที่
    Od_Upd_Date: Joi.date().optional(), // วันที่
    Od_NAV_Upd_Date: Joi.date().allow(null).optional(), // วันที่
    Carbide_Cost: Joi.number().precision(2).allow(null).optional(), // ค่าเงิน
    Steel_Cost: Joi.number().precision(2).allow(null).optional(), // ค่าเงิน
    Outsourcing_Cost: Joi.number().precision(2).allow(null).optional(), // ค่าเงิน
    H_Treatment_Cost: Joi.number().precision(2).allow(null).optional(), // ค่าเงิน
    Coating_Cost: Joi.number().precision(2).allow(null).optional(), // ค่าเงิน
    Electrode_Cost: Joi.number().precision(2).allow(null).optional(), // ค่าเงิน
    Electroplate_Cost: Joi.number().precision(2).allow(null).optional(), // ค่าเงิน
    Tooling_Cost: Joi.number().precision(2).allow(null).optional(), // ค่าเงิน
    Jig_Cost: Joi.number().precision(2).allow(null).optional(), // ค่าเงิน
    Fixtures_Cost: Joi.number().precision(2).allow(null).optional(), // ค่าเงิน
    Od_CAT1: Joi.boolean().allow(null).optional(),
    Od_CAT2: Joi.boolean().allow(null).optional(),
    Od_CAT3: Joi.boolean().allow(null).optional(),
    Od_Pending: Joi.boolean().allow(null).optional(),
    Temp_Shipment: Joi.boolean().allow(null).optional(),
    Unreceived: Joi.boolean().allow(null).optional(),
    Current_Order: Joi.boolean().allow(null).optional(),
    Month_Plan: Joi.boolean().allow(null).optional(),
    Week_Plan: Joi.boolean().allow(null).optional(),
    Today_Plan: Joi.boolean().allow(null).optional(),
    Must_Delivery: Joi.boolean().allow(null).optional(),
    Into_I: Joi.boolean().allow(null).optional(),
    Input_Confirm: Joi.boolean().allow(null).optional(),
    Pd_Confirm: Joi.boolean().allow(null).optional(),
    I_Confirm: Joi.boolean().allow(null).optional(),
    Od_Confirm: Joi.boolean().allow(null).optional(),
    I_Target: Joi.boolean().allow(null).optional(),
    Urgent_Goods: Joi.boolean().allow(null).optional()
});

module.exports = { td_orderSchema };
