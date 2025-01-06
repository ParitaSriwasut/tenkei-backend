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


exports.get_customer_info_SOrder = async (req, res, next) => {
  try {
      // Select only the required fields from the tm_customer table
      const customer = await prisma.tM_Customer.findMany({
          select: {
              Customer_CD: true,
              Customer_Abb: true,
              Customer_Name: true,
              Customer_Remark: true,
          },
      })

      // Send the selected data back to the user
      return res.status(200).json({
          status: "success",
          data: {
              customer: customer,
          },
      })
  } catch (err) {
      console.error("Error searching customer:", err)
      return next(createError(500, "Internal Server Error"))
  }
}
exports.get_unit_SOrder = async (req, res, next) => {
  try {
      // Select only the required fields from the tm_customer table
      const unit = await prisma.tM_Unit.findMany({
          select: {
              Unit_CD: true,
              Unit_Abb: true,
              Unit_Name: true,
              Unit_Remark: true,
          },
      })

      // Send the selected data back to the user
      return res.status(200).json({
          status: "success",
          data: {
            unit: unit,
          },
      })
  } catch (err) {
      console.error("Error searching unit:", err)
      return next(createError(500, "Internal Server Error"))
  }
}

exports.get_od_quote_SOrder = async (req, res, next) => {
  try {
      // Select only the required fields from the tm_customer table
      const od_quote = await prisma.tM_Od_Quote.findMany({
          select: {
              Od_Quote_CD: true,
              Od_Quote_Abb: true,
              Od_Quote_Name: true,
              Od_Quote_Remark: true,
          },
      })

      // Send the selected data back to the user
      return res.status(200).json({
          status: "success",
          data: {
            od_quote: od_quote,
          },
      })
  } catch (err) {
      console.error("Error searching od quote:", err)
      return next(createError(500, "Internal Server Error"))
  }
}

exports.get_currency_SOrder = async (req, res, next) => {
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

exports.get_contract_docu_SOrder = async (req, res, next) => {
  try {
     
    const contract_docu = await prisma.tM_Contract_Docu.findMany();

  
    return res.status(200).json({
      status: "success",
      data: {
        contract_docu: contract_docu,
      },
    });
  } catch (err) {
    console.error("Error searching contract document:", err);
    return next(createError(500, "Internal Server Error"));
  }
};