const Joi = require('joi');
const procureSchema = Joi.object({
  Order_No: Joi.string().optional().allow(null, ''), // หมายเลขคำสั่ง (Short Text)
  Procure_No: Joi.string().optional().allow(null, ''), // หมายเลขการจัดซื้อ (Short Text)
  OdPc_No: Joi.string().optional().allow(null, ''), // หมายเลข OdPc (Short Text)
  OdPcLn_No: Joi.string().optional().allow(null, ''), // หมายเลข OdPcLn (Short Text) ต้องกรอก
  Vendor_CAT: Joi.string().optional().allow(null, ''),  // หมวดหมู่ผู้จำหน่าย (Short Text)
  Vendor_CD: Joi.string().optional().allow(null, ''),  // รหัสผู้จำหน่าย (Short Text)
  Pc_Name: Joi.string().optional().allow(null, ''), // ชื่อการจัดซื้อ (Short Text)
  Pc_Material: Joi.string().optional().allow(null, ''), // วัสดุการจัดซื้อ (Short Text)
  Pc_Mate_Docu: Joi.boolean().optional().allow(null), // เอกสารวัสดุการจัดซื้อ (Short Text)
  Temp_Price: Joi.boolean().optional().allow(null), // ราคาชั่วคราว (Price CD)
  Unit_Price: Joi.number().precision(2).optional().allow(null), // ราคาต่อหน่วย
  Yes_No_1: Joi.boolean().optional().allow(null), // ใช่/ไม่ใช่ 1
  Yes_No_2: Joi.boolean().optional().allow(null), // ใช่/ไม่ใช่ 2
  Short_Text_1: Joi.string().optional().allow(null, ''), // ข้อความสั้น 1 (Short Text)
  Number_1: Joi.number().integer().optional().allow(null), // หมายเลข 1 (Number)
  Number_2: Joi.number().integer().optional().allow(null), // หมายเลข 2 (Number)
  Pc_Qty: Joi.number().integer().optional().allow(null), // จำนวนการจัดซื้อ
  Pc_Unit_CD: Joi.string().optional().allow(null, ''), // รหัสหน่วยการจัดซื้อ (Short Text)
  Pc_Person_CD: Joi.string().optional().allow(null, ''), // รหัสบุคคลที่ทำการจัดซื้อ (Short Text)
  Pc_Date: Joi.date().optional().allow(null), // วันที่การจัดซื้อ
  Pc_Req_Delivery: Joi.date().optional().allow(null), // วันที่ขอการจัดส่ง
  Pc_Req_Delivery_CD: Joi.string().optional().allow(null, ''), // รหัสการขอการจัดส่ง (Short Text)
  Pc_Ans_Delivery: Joi.date().optional().allow(null), // วันที่ตอบการจัดส่ง
  Pc_Ans_Delivery_CD: Joi.string().optional().allow(null, ''), // รหัสการตอบการจัดส่ง (Short Text)
  Pc_Delivery_Judge: Joi.string().optional().allow(null, ''), // การตัดสินการจัดส่ง (Short Text)
  Pc_Progress_CD: Joi.string().optional().allow(null, ''), // รหัสความก้าวหน้า (Short Text)
  Pc_Send_Date: Joi.date().optional().allow(null), // วันที่ส่งการจัดซื้อ
  Pc_Arrival_Date: Joi.date().optional().allow(null), // วันที่ถึง (Arrival Date)
  Pc_Arrival_Qty: Joi.number().integer().optional().allow(null), // จำนวนที่ถึง (Arrival Quantity)
  Pc_Cancel_Date: Joi.date().optional().allow(null), // วันที่ยกเลิก
  Procure_Docu: Joi.string().optional().allow(null, ''), // เอกสารการจัดซื้อ (Hyperlink)
  Pc_Remark: Joi.string().optional().allow(null, ''), // หมายเหตุการจัดซื้อ (Short Text)
  Print: Joi.boolean().optional().allow(null), // พิมพ์ (Yes/No)
  Pc_Reg_Date: Joi.date().optional().allow(null), // วันที่ลงทะเบียนการจัดซื้อ
  Pc_Upd_Date: Joi.date().optional().allow(null), // วันที่อัปเดตการจัดซื้อ
  Pc_NAV_Reg_Date: Joi.date().optional().allow(null), // วันที่ลงทะเบียน NAV
  Pc_NAV_Upd_Date: Joi.date().optional().allow(null), // วันที่อัปเดต NAV
  Pc_Line_No: Joi.number().integer().optional().allow(null), // หมายเลขบรรทัด (Line Number)
});



  
  module.exports = {procureSchema};