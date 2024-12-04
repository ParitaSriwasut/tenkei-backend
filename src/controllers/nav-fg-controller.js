const createError = require("../utils/create-error");
const prisma = require("../models/prisma");
const Joi = require("joi"); 

// สร้าง Schema สำหรับ Validation
const navFGSchema = Joi.object({
  Item_Name: Joi.string().allow(null).optional(),
  Customer_Name: Joi.string().allow(null).optional(),
  Order_Date: Joi.date().allow(null).optional(),
  Order_No: Joi.string().required(),
  Request_Delivery: Joi.date().allow(null).optional(),
  I_Completed_Date: Joi.date().allow(null).optional(),
  Date_of_Delay: Joi.number().integer().allow(null).optional(),
  NAV_Name: Joi.string().allow(null).optional(),
  NAV_Size: Joi.string().allow(null).optional(),
  Item1_CD: Joi.string().allow(null).optional(),
  Quantity: Joi.number().allow(null).optional(),
  Unit_Price: Joi.number().allow(null).optional(),
  Amount: Joi.number().allow(null).optional(),
});


exports.fetchNAVFG = async (req, res, next) => {
  try {
    const NAVFG = await prisma.tT_NAV_Od_FG.findMany();

    return res.status(200).json({
      status: "success",
      data: {
        NAVFG: NAVFG,
      },
    });
  } catch (err) {
    console.error("Error searching NAVFG:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.NoneFG = async (req, res, next) => {
  try {
    const result = await prisma.tD_Cost.findMany({
      include: {
        TD_Order: {
          include: {
            TT_NAV_Od_FG: true, // LEFT JOIN TT_NAV_Od_FG
          },
        },
      },
    });

    return res.status(200).json({
      status: "success",
      data: {
        result: result,
      },
    });
  } catch (err) {
    console.error("Error searching NAVFG:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.NoneFGTENKEI = async (req, res, next) => {
  try {
    // ดึงผลลัพธ์จาก tD_Cost
    const results = await prisma.tD_Cost.findMany({
      where: {
        Cs_Progress_CD: "4",
        CMC: {
          not: null, // ตรวจสอบว่า CMC มีค่า
        },
        Cs_Complete_Date: {
          equals: new Date(), // ตรวจสอบวันที่การทำเสร็จสมบูรณ์
        },
      },
      include: {
        TM_Resource: {
          where: {
            CostG_CD: "QC-FG", // ตรวจสอบว่า CostG_CD เท่ากับ "QC-FG"
          },
        },
        TD_Order: true, // รวมข้อมูลจาก TD_Order
      },
    });

    // ดึงผลลัพธ์จาก tT_NAV_Od_FG
    const results2 = await prisma.tT_NAV_Od_FG.findMany({});

    // ทำ LEFT JOIN โดยการจับคู่ข้อมูลจาก results กับ results2
    const joinedResults = results.map((result) => {
      // หาข้อมูลที่ตรงกันใน results2 โดยใช้ Order_No
      const matchingResults2 = results2.filter(
        (result2) => result2.Order_No === result.Order_No
      );

      // เพิ่มข้อมูลจาก results2 ลงในผลลัพธ์ (หากไม่มีข้อมูลจะเป็นอาร์เรย์ว่าง)
      return {
        ...result,
        results2: matchingResults2.length > 0 ? matchingResults2 : null, // ถ้ามีข้อมูลตรงกัน จะรวมไว้, ถ้าไม่มีจะเป็น null
      };
    });

    return res.status(200).json({
      status: "success",
      data: {
        result: joinedResults,
      },
    });
  } catch (err) {
    console.error("Error searching NoneFGTENKEI:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.updateNAVFG = async (req, res, next) => {
  try {
    // ตรวจสอบข้อมูล
    const { error, value } = navFGSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // ข้อมูลที่ตรวจสอบแล้ว
    const navFGData = value;

    console.log("NAVFG Data to be updated:", navFGData);

    // อัปเดตข้อมูลในฐานข้อมูล
    const updatedNAVFG = await prisma.tT_NAV_Od_FG.update({
      where: { Order_No: navFGData.Order_No }, // ระบุเงื่อนไขการค้นหา
      data: {
        ...navFGData, // ข้อมูลที่ต้องการอัปเดต
      },
    });

    // ส่งคำตอบกลับ
    return res
      .status(200)
      .json({ message: "NAVFG updated successfully", navFG: updatedNAVFG });
  } catch (err) {
    console.error("Error updating NAVFG:", err);
    return next(createError(500, "Internal Server Error"));
  }
};
