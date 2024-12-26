const createError = require("../utils/create-error");
const prisma = require("../models/prisma");
const { procureSchema } = require("../validators/procure-validator");
const { date } = require("joi");

exports.Search_Order_No_AfterUpdate = async (req, res, next) => {
  try {
    // ล็อกข้อมูลที่รับเข้ามา
    console.log("Request Body:", req.body);

    // ตรวจสอบข้อมูลที่รับเข้ามา
    const { error } = procureSchema.validate(req.body);
    if (error) {
      console.error("Validation Error:", error.details[0].message);
      return next(createError(400, error.details[0].message));
    }

    // ดึงหมายเลขคำสั่งซื้อจากคำขอ
    let { Order_No: orderNo } = req.body;

    // ตรวจสอบว่า orderNo เป็นสตริงและมีความยาวที่เหมาะสม
    if (typeof orderNo !== "string" || orderNo.length < 10) {
      return next(
        createError(
          400,
          "Order number is required and must be at least 10 characters long"
        )
      );
    }

    let SON = 0;

    if (orderNo.length === 12) {
      SON = orderNo;
      orderNo = orderNo.substring(0, 10);
    }

    const order = await prisma.tD_Procure.findMany({
      where: { Order_No: orderNo },
    });

    // หากไม่พบหมายเลขคำสั่งซื้อ ส่งข้อผิดพลาด
    if (!order) {
      return next(createError(404, "Order not found"));
    }

    // ส่งข้อมูลหมายเลขคำสั่งซื้อกลับไปยังผู้ใช้
    return res.status(200).json({
      status: "success",
      data: {
        procure: order,
      },
    });
  } catch (err) {
    console.error("Error searching order:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.Search_procure_AfterUpdate = async (req, res, next) => {
  try {
    // ล็อกข้อมูลที่รับเข้ามา
    console.log("Request Body:", req.body);

    let { OdPcLn_No: OdPcLnNo } = req.body;

    const procure = await prisma.tD_Procure.findFirst({
      where: { OdPcLn_No: OdPcLnNo },
    });

    if (!procure) {
      return next(createError(404, "Procurement not found"));
    }

    // ส่งข้อมูลหมายเลขคำสั่งซื้อกลับไปยังผู้ใช้
    return res.status(200).json({
      status: "success",
      data: { procure: procure },
    });
  } catch (err) {
    console.error("Error searching order:", err);
    return next(createError(500, "Internal Server Error"));
  }
};
exports.createProcure = async (req, res, next) => {
  try {
    // ตรวจสอบข้อมูลที่ส่งเข้ามา
    const { Order_No, Procure_No, Pc_Line_No } = req.body; // ดึงค่า Order_No และ Procure_No จาก req.body

    const parsedPcLineNo = Number.isInteger(parseInt(Pc_Line_No, 10))
      ? parseInt(Pc_Line_No, 10)
      : null;

    const OdPcLn_No = Order_No + Procure_No + Pc_Line_No;
    const OdPc_No = Order_No + Procure_No;
    // สร้างข้อมูลใหม่
    const procureData = {
      ...req.body,
      OdPcLn_No, // กำหนดค่า OdPcLn_No
      OdPc_No,
      Pc_Line_No: parsedPcLineNo,
      Pc_Upd_Date: new Date().toISOString(),
      Pc_Reg_Date: new Date().toISOString(), // กำหนด Pc_Reg_Date
      Pc_Progress_CD: "1", // กำหนดค่า Pc_Progress_CD
      Vendor_CAT: "1",
      Pc_Qty: parseFloat(parseFloat(req.body[`Pc_Qty`]).toFixed(2)) || 0,
      Unit_Price: parseFloat(parseFloat(req.body[`Unit_Price`]).toFixed(2)) || 0,
      Pc_Arrival_Qty: parseFloat(parseFloat(req.body[`Pc_Arrival_Qty`]).toFixed(2)) || 0,
    };

    // ตรวจสอบข้อมูลที่ตรวจสอบแล้ว
    const { error, value } = procureSchema.validate(procureData);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // ล็อกข้อมูลที่ต้องการเพิ่ม
    console.log("Procure Data to be created:", procureData);

    // สร้างรายการ procure ใหม่ในฐานข้อมูล
    const newProcure = await prisma.tD_Procure.create({ data: procureData });

    return res
      .status(201)
      .json({ message: "Procure created successfully", procure: newProcure });
  } catch (err) {
    // ล็อกข้อผิดพลาดเพื่อการตรวจสอบ
    console.error("Error creating procure:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.updateProcure = async (req, res, next) => {
  try {
    const { Pc_Arrival_Date, Pc_Ans_Delivery } = req.body;
    let Pc_Progress_CD = req.body.Pc_Progress_CD;

    if (Pc_Ans_Delivery !== null) {
      if (Pc_Progress_CD < 2) {
        Pc_Progress_CD = "2";
      }
    }

    if (Pc_Arrival_Date !== null) {
      if (Pc_Progress_CD < 4) {
        Pc_Progress_CD = "4";
      }
    }

    const procureData = {
      ...req.body,
      Pc_Line_No: parseInt(req.body[`Pc_Line_No`]) || null,
      Pc_Upd_Date: new Date().toISOString(),
      Pc_Progress_CD: Pc_Progress_CD || "1", // ใช้ค่าที่ปรับแล้วหรือค่าพื้นฐาน
      Pc_Arrival_Date,
      Pc_Qty: parseFloat(parseFloat(req.body[`Pc_Qty`]).toFixed(2)) || 0,
      Unit_Price: parseFloat(parseFloat(req.body[`Unit_Price`]).toFixed(2)) || 0,
      Pc_Arrival_Qty: parseFloat(parseFloat(req.body[`Pc_Arrival_Qty`]).toFixed(2)) || 0,
    };

    // ตรวจสอบข้อมูลที่ตรวจสอบแล้ว
    const { error, value } = procureSchema.validate(procureData);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // ล็อกข้อมูลที่ต้องการเพิ่ม
    console.log("Procure Data to be edited", procureData);

    const updatedprocure = await prisma.tD_Procure.update({
      where: { OdPcLn_No: procureData.OdPcLn_No },
      data: {
        ...procureData,
      },
    });

    return res.status(201).json({
      message: "Procure updated successfully",
      procure: updatedprocure,
    });
  } catch (err) {
    // ล็อกข้อผิดพลาดเพื่อการตรวจสอบ
    console.error("Error updating procure:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.Vendor_CATProcure = async (req, res, next) => {
  try {
    const { Vendor_CAT } = req.body;
    let records; // ตัวแปรเพื่อเก็บข้อมูลที่จะส่งกลับใน response

    // ตรวจสอบค่า Vendor_CAT
    if (Vendor_CAT === "0") {
      const workGRecords = await prisma.tM_WorkG.findMany();
      records = workGRecords; // กำหนดข้อมูล Work Group ให้กับตัวแปร records

      if (workGRecords.length === 0) {
        return res.status(400).json({
          message: "No records found in Work Group! But OK?",
        });
      }
    } else if (Vendor_CAT === "1") {
      const vendorRecords = await prisma.tM_Vendor.findMany();
      records = vendorRecords; // กำหนดข้อมูล Vendor ให้กับตัวแปร records

      if (vendorRecords.length === 0) {
        return res.status(400).json({
          message: "No records found in Vendor! But OK?",
        });
      }
    } else {
      const workGRecords = await prisma.tM_WorkG.findMany();
      records = workGRecords;
    }

    // ส่งการตอบกลับพร้อมข้อมูลที่ดึงมา
    res.status(200).json({
      message: "Vendor validation passed.",
      data: records, // แสดงข้อมูลใน response
    });
  } catch (err) {
    // ล็อกข้อผิดพลาดเพื่อการตรวจสอบ
    console.error("Error validating Vendor:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.deleteProcure = async (req, res, next) => {
  try {
    const { OdPcLn_No } = req.body;

    if (!OdPcLn_No) {
      return res.status(400).json({ message: "OdPcLn_No is required" });
    }

    console.log("ProcureNo to be deleted:", OdPcLn_No);

    const deletedProcure = await prisma.tD_Procure.delete({
      where: { OdPcLn_No: OdPcLn_No },
    });

    return res.status(200).json({
      message: "Procure deleted successfully",
      procure: deletedProcure,
    });
  } catch (err) {
    // ล็อกข้อผิดพลาดเพื่อการตรวจสอบ
    console.error("Error deleting Procure:", err);
    return next(createError(500, "Internal Server Error"));
  }
};
