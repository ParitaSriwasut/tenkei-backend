const createError = require("../utils/create-error");
const prisma = require("../models/prisma");
const Joi = require("joi");

const navWISchema = Joi.object({
  Item_Name: Joi.string().allow(null).optional(),
  Customer_Name: Joi.string().allow(null).optional(),
  Order_No: Joi.string().required(),
  Order_Date: Joi.date().allow(null).optional(),
  Request_Delivery: Joi.date().allow(null).optional(),
  NAV_Name: Joi.string().allow(null).optional(),
  NAV_Size: Joi.string().allow(null).optional(),
  Item1_CD: Joi.string().allow(null).optional(),
  Quantity: Joi.number().allow(null).optional(),
  Unit_Price: Joi.number().allow(null).optional(),
  Amount: Joi.number().allow(null).optional(),
});

exports.fetchNAVWI = async (req, res, next) => {
  try {

    const NAVWI = await prisma.tT_NAV_Od_WI.findMany();


    return res.status(200).json({
      status: "success",
      data: {
        NAVWI: NAVWI,
      },
    });
  } catch (err) {
    console.error("Error searching NAVWI:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.NoneWI = async (req, res, next) => {
  try {

    const result = await prisma.tD_Order.findMany({
      where: {
        TT_NAV_Od_WI: {
          none: {}
        },
        Od_Progress_CD: {
          lt: "5"// กรองค่า < 5
        }
      },
      include: {
        TT_NAV_Od_WI: true
      }
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

exports.NoneWITENKEI = async (req, res, next) => {
  try {

    const results = await prisma.tT_NAV_Od_WI.findMany({
      where: {
        TD_Order: {
          // ใช้กรองเงื่อนไขของ TD_Order ที่ Od_Progress_CD < 5
          Od_Progress_CD: {
            lt: "5",
          },
        },
      },
      include: {
        TD_Order: true, // รวมข้อมูลที่เชื่อมโยงกับ TD_Order
      },
    });

    return res.status(200).json({
      status: "success",
      data: {
        result: results,
      },
    });

  } catch (err) {
    console.error("Error searching NAVFG:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.updateNAVWI = async (req, res, next) => {
  try {
    // ตรวจสอบข้อมูล
    const { error, value } = navWISchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // ข้อมูลที่ตรวจสอบแล้ว
    const navWIData = value;

    console.log("NAVWI Data to be updated:", navWIData);

    // อัปเดตข้อมูลในฐานข้อมูล
    const updatedNAVWI = await prisma.tT_NAV_Od_WI.update({
      where: { Order_No: navWIData.Order_No }, // ระบุเงื่อนไขการค้นหา
      data: {
        ...navWIData, // ข้อมูลที่ต้องการอัปเดต
      },
    });

    // ส่งคำตอบกลับ
    return res
      .status(200)
      .json({ message: "NAVWI updated successfully", navWI: updatedNAVWI });
  } catch (err) {
    console.error("Error updating NAVWI:", err);
    return next(createError(500, "Internal Server Error"));
  }
};