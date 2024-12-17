const createError = require("../utils/create-error");
const prisma = require("../models/prisma");


exports.fetchPrice = async (req, res, next) => {
    try {
     
      const price = await prisma.tM_Price.findMany();
  
      // ส่งข้อมูลทั้งหมดกลับไปยังผู้ใช้
      return res.status(200).json({
        status: "success",
        data: {
            price: price,
        },
      });
    } catch (err) {
      console.error("Error searching price:", err);
      return next(createError(500, "Internal Server Error"));
    }
  };