const createError = require("../utils/create-error");
const prisma = require("../models/prisma");


exports.fetchPcprogress = async (req, res, next) => {
    try {
     
      const pcprogress = await prisma.tM_Pc_Progress.findMany();
  
      // ส่งข้อมูลทั้งหมดกลับไปยังผู้ใช้
      return res.status(200).json({
        status: "success",
        data: {
            pcprogress: pcprogress,
        },
      });
    } catch (err) {
      console.error("Error searching pcprogress:", err);
      return next(createError(500, "Internal Server Error"));
    }
  };