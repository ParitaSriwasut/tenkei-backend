const createError = require("../utils/create-error");
const prisma = require("../models/prisma");


exports.fetchUnit = async (req, res, next) => {
    try {
     
      const unit = await prisma.tM_Unit.findMany();
  
      // ส่งข้อมูลทั้งหมดกลับไปยังผู้ใช้
      return res.status(200).json({
        status: "success",
        data: {
            unit: unit,
        },
      });
    } catch (err) {
      console.error("Error searching unit:", err);
      return next(createError(500, "Internal Server Error"));
    }
  };