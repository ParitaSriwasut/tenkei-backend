const createError = require("../utils/create-error");
const prisma = require("../models/prisma");


exports.fetchDelivery = async (req, res, next) => {
    try {
     
      const delivery = await prisma.tM_Delivery.findMany();
  
      // ส่งข้อมูลทั้งหมดกลับไปยังผู้ใช้
      return res.status(200).json({
        status: "success",
        data: {
            delivery: delivery,
        },
      });
    } catch (err) {
      console.error("Error searching delivery:", err);
      return next(createError(500, "Internal Server Error"));
    }
  };