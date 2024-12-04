const createError = require("../utils/create-error");
const prisma = require("../models/prisma");


exports.fetchOdquote = async (req, res, next) => {
    try {
     
      const odquote = await prisma.tM_Od_Quote.findMany();
  
    
      return res.status(200).json({
        status: "success",
        data: {
            odquote: odquote,
        },
      });
    } catch (err) {
      console.error("Error searching Odquote:", err);
      return next(createError(500, "Internal Server Error"));
    }
  };