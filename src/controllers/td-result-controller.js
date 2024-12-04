const createError = require("../utils/create-error");
const prisma = require("../models/prisma");

exports.Search_Parts_No_AfterUpdate = async (req, res, next) => { 
    try {
        console.log("Request Body:", req.body); 
    let { Order_No: orderNo, Parts_No: partsNO } = req.body;
    const OdPt_No = orderNo + partsNO;

    const Result = await prisma.tD_Plan.findFirst({
        where: { OdPt_No: OdPt_No },
        include:{
            Result: {
                where: { OdPt_No: OdPt_No },
           },
        },
      });
      return res.json(Result);
    } catch (err) {
      console.error("Error searching order:", err);
      return next(createError(500, "Internal Server Error"));
    }
}