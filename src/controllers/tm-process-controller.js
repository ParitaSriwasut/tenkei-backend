const createError = require("../utils/create-error");
const prisma = require("../models/prisma");
const { tm_processSchema } = require("../validators/process-validator");

exports.fetchProcess = async (req, res, next) => {
  try {

    const process = await prisma.tM_Process.findMany({
      where: {
        For_Info: true,
      },
      orderBy: {
        Process_Abb: 'asc',
      },
    });

    // ส่งข้อมูลทั้งหมดกลับไปยังผู้ใช้
    return res.status(200).json({
      status: "success",
      data: {
        process: process,
      },

    });
  } catch (err) {
    console.error("Error searching process:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.fetchAllProcess = async (req, res, next) => {
  try {
    const process = await prisma.tM_Process.findMany();
    return res.status(200).json({
      status: "success",
      data: {
        process: process,
      },
    });
  } catch (err) {
    console.error("Error fetching Process:", err);
    return next(createError(500, `Internal Server Error: ${err.message}`));
  }
};


exports.QM_Process = async (req, res, next) => {
  try {

    const process = await prisma.tM_Process.findMany({
      where: {
        For_Plan: true,
      },
      orderBy: {
        Process_Abb: 'asc',
      },
    });

    // ส่งข้อมูลทั้งหมดกลับไปยังผู้ใช้
    return res.status(200).json({
      status: "success",
      data: {
        process: process,
      },
    });
  } catch (err) {
    console.error("Error searching process:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.updateProcess = async (req, res, next) => {
  try {
    // ตรวจสอบข้อมูล
    const { error, value } = tm_processSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // ข้อมูลที่ตรวจสอบแล้ว
    const processData = value;

    console.log("Process Data to be updated:", processData);

    // อัปเดตข้อมูลในฐานข้อมูล
    const updateProcess = await prisma.tM_Process.update({
      where: { Process_CD: processData.Process_CD }, // ระบุเงื่อนไขการค้นหา
      data: {
        ...processData, // ข้อมูลที่ต้องการอัปเดต
      },
    });

    // ส่งคำตอบกลับ
    return res
      .status(200)
      .json({ message: "Process updated successfully", process: updateProcess });
  } catch (err) {
    console.error("Error updating Process:", err);
    return next(createError(500, "Internal Server Error"));
  }
};