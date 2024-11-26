const createError = require("../utils/create-error");
const prisma = require("../models/prisma");
const Joi = require("joi");

const workGSchema = Joi.object({
  WorkG_CD: Joi.string().required(),
  WorkG_Name: Joi.string().allow(null).optional(),
  WorkG_Abb: Joi.string().allow(null).optional(),
  WorkG_Symbol: Joi.string().allow(null).optional(),
  Pl_Object_Grp: Joi.string().allow(null).optional(),
  Pl_Object: Joi.boolean().allow(null).optional(),
  Target_Amount: Joi.number().allow(null).optional(),
  WorkG_Mark: Joi.string().allow(null).optional(),
});

exports.fetchWorkg = async (req, res, next) => {
  try {

    const workg = await prisma.tM_WorkG.findMany();

    return res.status(200).json({
      status: "success",
      data: {
        workg: workg,
      },
    });
  } catch (err) {
    console.error("Error searching workg:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.updateworkG = async (req, res, next) => {
  try {
    // ตรวจสอบข้อมูล
    const { error, value } = workGSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // ข้อมูลที่ตรวจสอบแล้ว
    const workGData = value;

    console.log("NAVWI Data to be updated:", workGData);

    // อัปเดตข้อมูลในฐานข้อมูล
    const updateworkG = await prisma.tM_WorkG.update({
      where: { WorkG_CD: workGData.WorkG_CD }, // ระบุเงื่อนไขการค้นหา
      data: {
        ...workGData, // ข้อมูลที่ต้องการอัปเดต
      },
    });

    // ส่งคำตอบกลับ
    return res
      .status(200)
      .json({ message: "workG updated successfully", workG: updateworkG });
  } catch (err) {
    console.error("Error updating workG:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

