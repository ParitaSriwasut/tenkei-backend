const createError = require("../utils/create-error");
const prisma = require("../models/prisma");
const { tm_vendorSchema } = require("../validators/vendor-validator");


exports.fetchVendor = async (req, res, next) => {
  try {

    const vendor = await prisma.tm_vendor.findMany();

    // ส่งข้อมูลทั้งหมดกลับไปยังผู้ใช้
    return res.status(200).json({
      status: "success",
      data: {
        vendor: vendor,
      },
    });
  } catch (err) {
    console.error("Error searching vendor:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.updateVendor = async (req, res, next) => {
  try {
    // ตรวจสอบข้อมูล
    const { error, value } = tm_vendorSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // ข้อมูลที่ตรวจสอบแล้ว
    const vendorData = value;

    console.log("Vendor Data to be updated:", vendorData);

    // อัปเดตข้อมูลในฐานข้อมูล
    const updateVendor = await prisma.tm_vendor.update({
      where: { Vendor_CD: vendorData.Vendor_CD }, // ระบุเงื่อนไขการค้นหา
      data: {
        ...vendorData, // ข้อมูลที่ต้องการอัปเดต
      },
    });

    // ส่งคำตอบกลับ
    return res
      .status(200)
      .json({ message: "Vendor updated successfully", vendor: updateVendor });
  } catch (err) {
    console.error("Error updating Vendor:", err);
    return next(createError(500, "Internal Server Error"));
  }
};