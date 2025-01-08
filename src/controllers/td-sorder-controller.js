const createError = require("../utils/create-error");
const { td_sorderSchema }= require("../validators/sorder-validator")
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

exports.post_createSOrder = async (req, res, next) => {
  try {
    // ตรวจสอบข้อมูล
    const { error, value } = td_sorderSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // ข้อมูลที่ตรวจสอบแล้ว
    const sorderData = value;
    

    console.log("SOrder Data to be created:", sorderData);

    // สร้างข้อมูลใหม่ในฐานข้อมูล
    const newSOrder = await prisma.tD_SOrder.create({
      data: {
        ...sorderData, // ข้อมูลที่ต้องการบันทึก
      },
    });

    // ส่งคำตอบกลับ
    return res
      .status(201)
      .json({ message: "SOrder created successfully", sorder: newSOrder });
  } catch (err) {
    console.error("Error creating SOrder:", err);
    return next(createError(500, "Internal Server Error"));
  }
};


exports.edit_SOrder = async (req, res, next) => {
  try {
    // ตรวจสอบข้อมูลที่ส่งเข้ามา
    const { error, value } = td_sorderSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // ข้อมูลที่ตรวจสอบแล้วสามารถใช้งานได้
    const sorderData = value;

    console.log("SOrder Data to be edited:", sorderData);

    // แปลงเวลาเป็น UTC+7
    const currentDate = new Date();
    const thailandTime = new Date(currentDate.getTime() + 7 * 60 * 60 * 1000); 

    // อัปเดตข้อมูลในฐานข้อมูล
    const updatedSOrder = await prisma.tD_SOrder.update({
      where: { SOrder_No: sorderData.SOrder_No },
      data: {
        ...sorderData,
        SO_Upd_Date: thailandTime, // บันทึกเป็นเวลาของประเทศไทย (UTC+7)
      },
    });

    // ส่งคำตอบกลับ
    return res
      .status(200)
      .json({ message: "SOrder updated successfully", sorder: updatedSOrder });
  } catch (err) {
    // ล็อกข้อผิดพลาดเพื่อการตรวจสอบ
    console.error("Error editing SOrder:", err);
    return next(createError(500, "Internal Server Error"));
  }
};



exports.delete_SOrder = async (req, res, next) => {
  try {
    // ตรวจสอบข้อมูลที่ส่งเข้ามา
    const { SOrder_No } = req.body; // สมมติว่า SOrder_No จะถูกส่งมาใน body

    // ตรวจสอบว่ามีการส่ง SOrder_No มาหรือไม่
    if (!SOrder_No) {
      return res.status(400).json({ message: "SOrder_No is required" });
    }

    // ล็อกข้อมูลที่ต้องการลบ
    console.log("SOrder No to be deleted:", SOrder_No);

    // ลบ SOrder
    const deletedSOrder = await prisma.tD_SOrder.delete({
      where: { SOrder_No: SOrder_No }, // ระบุเงื่อนไขในการค้นหา
    });

    // ส่งคำตอบกลับ
    return res
      .status(200)
      .json({ message: "SOrder deleted successfully", sorder: deletedSOrder });
  } catch (err) {
    // ล็อกข้อผิดพลาดเพื่อการตรวจสอบ
    console.error("Error deleting SOrder:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

