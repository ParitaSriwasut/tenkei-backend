const createError = require("../utils/create-error");
const prisma = require("../models/prisma");


exports.fetchSupply = async (req, res, next) => {
    try {
     
      const supply = await prisma.tM_Supply.findMany();
  
      // ส่งข้อมูลทั้งหมดกลับไปยังผู้ใช้
      return res.status(200).json({
        status: "success",
        data: {
            supply: supply,
        },
      });
    } catch (err) {
      console.error("Error searching supply:", err);
      return next(createError(500, "Internal Server Error"));
    }
  };