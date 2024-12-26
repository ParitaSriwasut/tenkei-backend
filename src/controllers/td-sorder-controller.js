const createError = require("../utils/create-error");
const prisma = require("../models/prisma");

exports.formLoad = async (req, res, next) => {
  try {
    const orderCount = await prisma.tD_SOrder.count();

    if (orderCount > 0) {
      return res.status(200).json({
        message: "Search permission granted.",
        action: "GoToNewRecord",
      });
    } else {
      return res.status(200).json({
        message: "No data found in the database.",
        action: "AlertUser",
      });
    }
  } catch (error) {
    console.error("Error in formLoad:", error);
    next(
      createError(
        500,
        "Error occurs when loading form. Please contact system administrator."
      )
    );
  }
};

exports.Search_SOrder_No_AfterUpdate = async (req, res, next) => {
  try {
    console.log("Request Body:", req.body);
    let { SOrder_No } = req.body;
    const SOrder = await prisma.tD_SOrder.findFirst({
        where: { SOrder_No: SOrder_No },
   
      });
      return res.status(200).json({
        status: "success",
        data: {
          sorder: SOrder,
        },
      });
 
  } catch (error) {
    console.error("Error in Search sorder:", error);
    next(
      createError(
        500,
        "Error occurs when loading form. Please contact system administrator."
      )
    );
  }
};
