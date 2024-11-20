const createError = require("../utils/create-error");
const prisma = require("../models/prisma");

exports.fetchNAVWI = async (req, res, next) => {
    try {
     
      const NAVWI = await prisma.tT_NAV_Od_WI.findMany();
  
    
      return res.status(200).json({
        status: "success",
        data: {
            NAVWI: NAVWI,
        },
      });
    } catch (err) {
      console.error("Error searching NAVWI:", err);
      return next(createError(500, "Internal Server Error"));
    }
  };

  exports.NoneWI= async (req, res, next) => {
    try {
     
      const result = await prisma.tD_Order.findMany({
        where: {
          TT_NAV_Od_WI: {
            none: {}
          },
          Od_Progress_CD: {
            lt: "5"// กรองค่า < 5
          }
        },
        include: {
          TT_NAV_Od_WI: true
        }
      });
    
      return res.status(200).json({
        status: "success",
        data: {
          result: result,
        },
      });
    } catch (err) {
      console.error("Error searching NAVFG:", err);
      return next(createError(500, "Internal Server Error"));
    }
  };

  exports.NoneWITENKEI= async (req, res, next) => {
    try {
  

      const results = await prisma.tT_NAV_Od_WI.findMany({
        where: {
          TD_Order: {
            // ใช้กรองเงื่อนไขของ TD_Order ที่ Od_Progress_CD < 5
            Od_Progress_CD: {
              lt: "5",
            },
          },
        },
        include: {
          TD_Order: true, // รวมข้อมูลที่เชื่อมโยงกับ TD_Order
        },
      });



    return res.status(200).json({
      status: "success",
      data: {
        result: results,
      },
    });

    } catch (err) {
      console.error("Error searching NAVFG:", err);
      return next(createError(500, "Internal Server Error"));
    }
    };