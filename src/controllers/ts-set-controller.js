const createError = require("../utils/create-error");
const prisma = require("../models/prisma");
const { ts_setSchema } = require("../validators/set-validator");

exports.fetchSet = async (req, res, next) => {
  try {
    const set = await prisma.tS_Set.findMany();
    return res.status(200).json({
      status: "success",
      data: {
        set: set,
      },
    });
  } catch (err) {
    console.error("Error fetching set:", err);
    return next(createError(500, `Internal Server Error: ${err.message}`));
  }
};

exports.updateSet = async (req, res, next) => {
  try {
    // ตรวจสอบข้อมูล
    const { error, value } = ts_setSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // ข้อมูลที่ตรวจสอบแล้ว
    const setData = value;

    console.log("Set Data to be updated:", setData);

    // อัปเดตข้อมูลในฐานข้อมูล
    const updateSet = await prisma.tS_Set.update({
      where: { ID: setData.ID }, // ระบุเงื่อนไขการค้นหา
      data: {
        ...setData, // ข้อมูลที่ต้องการอัปเดต
      },
    });

    // ส่งคำตอบกลับ
    return res
      .status(200)
      .json({ message: "Set updated successfully", set: updateSet });
  } catch (err) {
    console.error("Error updating Set:", err);
    return next(createError(500, "Internal Server Error"));
  }
};
