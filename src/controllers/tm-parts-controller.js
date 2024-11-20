const createError = require("../utils/create-error");
const prisma = require("../models/prisma");

exports.fetchParts = async (req, res, next) => {
    try {
     
      const parts = await prisma.tm_parts.findMany();
  
      // ส่งข้อมูลทั้งหมดกลับไปยังผู้ใช้
      return res.status(200).json({
        status: "success",
        data: {
            parts: parts,
        },
      });
    } catch (err) {
      console.error("Error searching parts:", err);
      return next(createError(500, "Internal Server Error"));
    }
  };