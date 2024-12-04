const createError = require("../utils/create-error");
const prisma = require("../models/prisma");


exports.fetchInoutside= async (req, res, next) => {
    try {
     
      const outside = await prisma.tM_InOutside.findMany();
  
      // ส่งข้อมูลทั้งหมดกลับไปยังผู้ใช้
      return res.status(200).json({
        status: "success",
        data: {
            outside: outside,
        },
      });
    } catch (err) {
      console.error("Error searching outside:", err);
      return next(createError(500, "Internal Server Error"));
    }
  };