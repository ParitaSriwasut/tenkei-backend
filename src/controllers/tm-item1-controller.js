const createError = require("../utils/create-error");
const prisma = require("../models/prisma");


exports.fetchItem1 = async (req, res, next) => {
    try {
     
      const item1 = await prisma.tM_Item1.findMany();
  
    
      return res.status(200).json({
        status: "success",
        data: {
            item1: item1,
        },
      });
    } catch (err) {
      console.error("Error searching item1:", err);
      return next(createError(500, "Internal Server Error"));
    }
  };