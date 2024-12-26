const createError = require("../utils/create-error");
const prisma = require("../models/prisma");


exports.fetchCurrency= async (req, res, next) => {
    try {
     
      const currency = await prisma.tM_Currency.findMany();
  
    
      return res.status(200).json({
        status: "success",
        data: {
            currency: currency,
        },
      });
    } catch (err) {
      console.error("Error searching currency:", err);
      return next(createError(500, "Internal Server Error"));
    }
  };