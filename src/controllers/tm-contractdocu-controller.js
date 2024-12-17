const createError = require("../utils/create-error");
const prisma = require("../models/prisma");


exports.fetchContractDocu = async (req, res, next) => {
    try {
     
      const docu  = await prisma.tM_Contract_Docu.findMany();
  
    
      return res.status(200).json({
        status: "success",
        data: {
            docu: docu,
        },
      });
    } catch (err) {
      console.error("Error searching docu:", err);
      return next(createError(500, "Internal Server Error"));
    }
  };