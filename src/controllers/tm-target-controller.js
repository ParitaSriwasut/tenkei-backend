const createError = require("../utils/create-error");
const prisma = require("../models/prisma");


exports.fetchTarget = async (req, res, next) => {
    try {
     
      const target = await prisma.tM_Target.findMany();
  
      // ส่งข้อมูลทั้งหมดกลับไปยังผู้ใช้
      return res.status(200).json({
        status: "success",
        data: {
        target: target,
        },
      });
    } catch (err) {
      console.error("Error searching target:", err);
      return next(createError(500, "Internal Server Error"));
    }
  };