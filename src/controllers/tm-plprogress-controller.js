const createError = require("../utils/create-error");
const prisma = require("../models/prisma");

exports.fetchPlprogress = async (req, res, next) => {
    try {
     
      const plprogress = await prisma.tM_Pl_Progress.findMany();
  
      // ส่งข้อมูลทั้งหมดกลับไปยังผู้ใช้
      return res.status(200).json({
        status: "success",
        data: {
            plprogress: plprogress,
        },
        
      });
    } catch (err) {
      console.error("Error searching plprogress:", err);
      return next(createError(500, "Internal Server Error"));
    }
  };
