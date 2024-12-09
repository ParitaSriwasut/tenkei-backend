const createError = require("../utils/create-error");
const prisma = require("../models/prisma");

exports.fetchplanppc = async (req, res, next) => {
    try {
     
      const planppc = await prisma.tT_Plan_PPC.findMany();
  
    
      return res.status(200).json({
        status: "success",
        data: {
            planppc: planppc,
        },
      });
    } catch (err) {
      console.error("Error searching planppc:", err);
      return next(createError(500, "Internal Server Error"));
    }
  };