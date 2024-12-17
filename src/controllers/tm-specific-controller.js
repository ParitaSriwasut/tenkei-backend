const createError = require("../utils/create-error");
const prisma = require("../models/prisma");


exports.fetchSpecific = async (req, res, next) => {
    try {
     
      const specific = await prisma.tM_Specific.findMany();
  
      // ส่งข้อมูลทั้งหมดกลับไปยังผู้ใช้
      return res.status(200).json({
        status: "success",
        data: {
            specific: specific,
        },
      });
    } catch (err) {
      console.error("Error searching specific:", err);
      return next(createError(500, "Internal Server Error"));
    }
  };