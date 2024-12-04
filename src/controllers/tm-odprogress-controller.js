const createError = require("../utils/create-error");
const prisma = require("../models/prisma");


exports.fetchOdprogress = async (req, res, next) => {
    try {
     
      const progress = await prisma.tM_Od_Progress.findMany();
  
    
      return res.status(200).json({
        status: "success",
        data: {
            progress: progress,
        },
      });
    } catch (err) {
      console.error("Error searching progress:", err);
      return next(createError(500, "Internal Server Error"));
    }
  };