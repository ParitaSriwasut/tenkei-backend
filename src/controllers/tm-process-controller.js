const createError = require("../utils/create-error");
const prisma = require("../models/prisma");

exports.fetchProcess = async (req, res, next) => {
    try {
     
      const process = await prisma.tM_Process.findMany({
        where: { 
            For_Info: true, 
          },
          orderBy: { 
            Process_Abb: 'asc', 
          },
      });
  
      // ส่งข้อมูลทั้งหมดกลับไปยังผู้ใช้
      return res.status(200).json({
        status: "success",
        data: {
            process: process,
        },
        
      });
    } catch (err) {
      console.error("Error searching process:", err);
      return next(createError(500, "Internal Server Error"));
    }
  };


  exports.QM_Process = async (req, res, next) => {
    try {
     
        const process = await prisma.tM_Process.findMany({
            where: { 
              For_Plan: true, 
            },
            orderBy: { 
              Process_Abb: 'asc', 
            },
          });
  
      // ส่งข้อมูลทั้งหมดกลับไปยังผู้ใช้
      return res.status(200).json({
        status: "success",
        data: {
            process: process,
        },
      });
    } catch (err) {
      console.error("Error searching process:", err);
      return next(createError(500, "Internal Server Error"));
    }
  };