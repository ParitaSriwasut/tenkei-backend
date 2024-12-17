const createError = require("../utils/create-error");
const prisma = require("../models/prisma");
const Joi = require("joi");

const holidaySchema = Joi.object({
    Holiday: Joi.date().required(),
    Holiday_Name: Joi.string().allow(null).optional(),
    Coefficient: Joi.number().integer().allow(null).optional(),
    Holiday_Remark: Joi.string().allow(null).optional(),
  });  

exports.fetchHoliday = async (req, res, next) => {
  try {

    const holiday = await prisma.tM_Holiday.findMany();

    return res.status(200).json({
      status: "success",
      data: {
        holiday: holiday,
      },
    });
  } catch (err) {
    console.error("Error searching holiday:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.updateHoliday= async (req, res, next) => {
  try {
    // ตรวจสอบข้อมูล
    const { error, value } = holidaySchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // ข้อมูลที่ตรวจสอบแล้ว
    const holidayData = value;

    console.log("Holiday Data to be updated:", holidayData);

    // อัปเดตข้อมูลในฐานข้อมูล
    const updateHoliday = await prisma.tM_Holiday.update({
      where: { Holiday: holidayData.Holiday }, // ระบุเงื่อนไขการค้นหา
      data: {
        ...holidayData, // ข้อมูลที่ต้องการอัปเดต
      },
    });

    // ส่งคำตอบกลับ
    return res
      .status(200)
      .json({ message: "workG updated successfully", holiday: updateHoliday });
  } catch (err) {
    console.error("Error updating holiday:", err);
    return next(createError(500, "Internal Server Error"));
  }
};