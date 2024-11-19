const createError = require("../utils/create-error");
const prisma = require("../models/prisma");


exports.fetchSchedule = async (req, res, next) => {
    try {
     
      const schedule = await prisma.tm_schedule.findMany();
  
      // ส่งข้อมูลทั้งหมดกลับไปยังผู้ใช้
      return res.status(200).json({
        status: "success",
        data: {
            schedule: schedule,
        },
      });
    } catch (err) {
      console.error("Error searching schedule:", err);
      return next(createError(500, "Internal Server Error"));
    }
  };