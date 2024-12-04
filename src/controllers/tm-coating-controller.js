const createError = require("../utils/create-error");
const prisma = require("../models/prisma");
const Joi = require("joi");

const coatingSchema = Joi.object({
  Coating_CD: Joi.string().required(),
  Coating_Name: Joi.string().allow(null).optional(),
  Coating_Abb: Joi.string().allow(null).optional(),
  Coating_Symbol: Joi.string().allow(null).optional(),
  Coating_Remark: Joi.string().allow(null).optional(),
});


exports.fetchCoating = async (req, res, next) => {
  try {

    const coating = await prisma.tM_Coating.findMany();

    // ส่งข้อมูลทั้งหมดกลับไปยังผู้ใช้
    return res.status(200).json({
      status: "success",
      data: {
        coating: coating,
      },
    });
  } catch (err) {
    console.error("Error searching target:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.updateCoating = async (req, res, next) => {
  try {
    // ตรวจสอบข้อมูล
    const { error, value } = coatingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // ข้อมูลที่ตรวจสอบแล้ว
    const coatingData = value;

    console.log("Coating Data to be updated:", coatingData);

    // อัปเดตข้อมูลในฐานข้อมูล
    const updateCoating = await prisma.tM_Coating.update({
      where: { Coating_CD: coatingData.Coating_CD }, // ระบุเงื่อนไขการค้นหา
      data: {
        ...coatingData, // ข้อมูลที่ต้องการอัปเดต
      },
    });

    // ส่งคำตอบกลับ
    return res
      .status(200)
      .json({ message: "Coating updated successfully", coating: updateCoating });
  } catch (err) {
    console.error("Error updating Coating:", err);
    return next(createError(500, "Internal Server Error"));
  }
};