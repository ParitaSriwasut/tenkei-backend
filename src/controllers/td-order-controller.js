const createError = require("../utils/create-error");
const prisma = require("../models/prisma");
const { td_orderSchema } = require("../validators/order-validator");
const { tm_customerSchema } = require("../validators/customer-validator");
const { tm_workerSchema } = require("../validators/worker-validator");

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0"); // แปลงวันที่เป็นรูปแบบ 2 หลัก
  const month = String(date.getMonth() + 1).padStart(2, "0"); // เดือนต้องบวก 1 เพราะเริ่มนับจาก 0
  const year = date.getFullYear();
  return `${day}/${month}/${year}`; // คืนค่าวันที่ในรูปแบบ dd/mm/yyyy
};

exports.fetchOrders = async (req, res, next) => {
  try {
    // ดึงข้อมูลทั้งหมดจาก TD_Order โดยไม่ต้องใช้เงื่อนไข
    const orders = await prisma.tD_Order.findMany();

    // ส่งข้อมูลทั้งหมดกลับไปยังผู้ใช้
    return res.status(200).json({
      status: "success",
      data: {
        orders: orders,
      },
    });
  } catch (err) {
    console.error("Error searching orders:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.Search_Order_No_AfterUpdate = async (req, res, next) => {
  try {
    // ล็อกข้อมูลที่รับเข้ามา
    console.log("Request Body:", req.body);

    // ตรวจสอบข้อมูลที่รับเข้ามา
    const { error } = td_orderSchema.validate(req.body);
    if (error) {
      console.error("Validation Error:", error.details[0].message);
      return next(createError(400, error.details[0].message));
    }

    // ดึงหมายเลขคำสั่งซื้อจากคำขอ
    let { Order_No: orderNo } = req.body; // ใช้ destructuring เพื่อดึง Order_No

    // ตรวจสอบว่า orderNo เป็นสตริงและมีความยาวที่เหมาะสม
    if (typeof orderNo !== "string" || orderNo.length < 10) {
      return next(
        createError(
          400,
          "Order number is required and must be at least 10 characters long"
        )
      );
    }

    // กำหนดตัวแปร SON (ใช้ในกรณีที่ OrderNo มีความยาว 12)
    let SON = 0;

    // ตรวจสอบความยาวของหมายเลขคำสั่งซื้อ
    if (orderNo.length === 12) {
      SON = orderNo;
      orderNo = orderNo.substring(0, 10); // ตัดหมายเลขคำสั่งซื้อเหลือ 10 ตัวอักษร
    }

    // ค้นหาในฐานข้อมูลโดยใช้ Prisma (ไม่มีการจอย)
    const order = await prisma.tD_Order.findUnique({
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
        order: order,
      },
    });
  } catch (err) {
    console.error("Error searching order:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.tm_workerg = async (req, res, next) => {
  try {
    // ดึงข้อมูลทั้งหมดจาก TD_Order โดยไม่ต้องใช้เงื่อนไข
    const workerg = await prisma.tM_WorkG.findMany();

    // ส่งข้อมูลทั้งหมดกลับไปยังผู้ใช้
    return res.status(200).json({
      status: "success",
      data: {
        workerg: workerg,
      },
    });
  } catch (err) {
    console.error("Error searching workerg:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.tm_request1 = async (req, res, next) => {
  try {
    // ดึงข้อมูลทั้งหมดจาก TD_Order โดยไม่ต้องใช้เงื่อนไข
    const request1 = await prisma.tm_request1.findMany();

    // ส่งข้อมูลทั้งหมดกลับไปยังผู้ใช้
    return res.status(200).json({
      status: "success",
      data: {
        request1: request1,
      },
    });
  } catch (err) {
    console.error("Error searching request1:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.tm_request2 = async (req, res, next) => {
  try {
    // ดึงข้อมูลทั้งหมดจาก TD_Order โดยไม่ต้องใช้เงื่อนไข
    const request2 = await prisma.tm_request2.findMany();

    // ส่งข้อมูลทั้งหมดกลับไปยังผู้ใช้
    return res.status(200).json({
      status: "success",
      data: {
        request2: request2,
      },
    });
  } catch (err) {
    console.error("Error searching request2:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.tm_request3 = async (req, res, next) => {
  try {
    // ดึงข้อมูลทั้งหมดจาก TD_Order โดยไม่ต้องใช้เงื่อนไข
    const request3 = await prisma.tm_request3.findMany();

    // ส่งข้อมูลทั้งหมดกลับไปยังผู้ใช้
    return res.status(200).json({
      status: "success",
      data: {
        request3: request3,
      },
    });
  } catch (err) {
    console.error("Error searching request3:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.tm_worker = async (req, res, next) => {
  try {
    // ดึงข้อมูลทั้งหมดจาก TD_Order โดยไม่ต้องใช้เงื่อนไข
    const worker = await prisma.tM_Worker.findMany();

    // ส่งข้อมูลทั้งหมดกลับไปยังผู้ใช้
    return res.status(200).json({
      status: "success",
      data: {
        worker: worker,
      },
    });
  } catch (err) {
    console.error("Error searching worker:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.updateWorker = async (req, res, next) => {
  try {
    // ตรวจสอบข้อมูล
    const { error, value } = tm_workerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // ข้อมูลที่ตรวจสอบแล้ว
    const workerData = value;

    console.log("Worker Data to be updated:", workerData);

    // อัปเดตข้อมูลในฐานข้อมูล
    const updateWorker = await prisma.tM_Worker.update({
      where: { Worker_CD: workerData.Worker_CD }, // ระบุเงื่อนไขการค้นหา
      data: {
        ...workerData, // ข้อมูลที่ต้องการอัปเดต
      },
    });

    // ส่งคำตอบกลับ
    return res
      .status(200)
      .json({ message: "Worker updated successfully", worker: updateWorker });
  } catch (err) {
    console.error("Error updating Worker:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.tm_customer = async (req, res, next) => {
  try {
    // ดึงข้อมูลเฉพาะคอลัมน์ WorkG_CD จากตาราง tm_workerg
    const customer = await prisma.tM_Customer.findMany();

    // ส่งข้อมูลทั้งหมดกลับไปยังผู้ใช้
    return res.status(200).json({
      status: "success",
      data: {
        customer: customer,
      },
    });
  } catch (err) {
    console.error("Error searching customer:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.updateCustomer = async (req, res, next) => {
  try {
    // ตรวจสอบข้อมูล
    const { error, value } = tm_customerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // ข้อมูลที่ตรวจสอบแล้ว
    const customerData = value;

    console.log("Customer Data to be updated:", customerData);

    // อัปเดตข้อมูลในฐานข้อมูล
    const updateCustomer = await prisma.tM_Customer.update({
      where: { Customer_CD: customerData.Customer_CD }, // ระบุเงื่อนไขการค้นหา
      data: {
        ...customerData, // ข้อมูลที่ต้องการอัปเดต
      },
    });

    // ส่งคำตอบกลับ
    return res
      .status(200)
      .json({ message: "Customer updated successfully", customer: updateCustomer });
  } catch (err) {
    console.error("Error updating Customer:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.editOrder = async (req, res, next) => {
  try {
    // ตรวจสอบข้อมูลที่ส่งเข้ามา
    const { error, value } = td_orderSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // ข้อมูลที่ตรวจสอบแล้วสามารถใช้งานได้
    const orderData = value;

    console.log("Order Data to be edited:", orderData);

    // อัปเดตข้อมูลในฐานข้อมูล
    const updatedOrder = await prisma.tD_Order.update({
      where: { Order_No: orderData.Order_No }, // ระบุเงื่อนไขในการค้นหา
      data: {
        ...orderData, // ข้อมูลที่ต้องการแก้ไข
      },
    });

    // ส่งคำตอบกลับ
    return res
      .status(200)
      .json({ message: "Order updated successfully", order: updatedOrder });
  } catch (err) {
    // ล็อกข้อผิดพลาดเพื่อการตรวจสอบ
    console.error("Error editing order:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    // ตรวจสอบข้อมูลที่ส่งเข้ามา
    const { Order_No } = req.body; // สมมติว่า Order_No จะถูกส่งมาใน body

    // ตรวจสอบว่ามีการส่ง Order_No มาหรือไม่
    if (!Order_No) {
      return res.status(400).json({ message: "Order_No is required" });
    }

    // ล็อกข้อมูลที่ต้องการลบ
    console.log("Order No to be deleted:", Order_No);

    // ลบคำสั่ง
    const deletedOrder = await prisma.tD_Order.delete({
      where: { Order_No: Order_No }, // ระบุเงื่อนไขในการค้นหา
    });

    // ส่งคำตอบกลับ
    return res
      .status(200)
      .json({ message: "Order deleted successfully", order: deletedOrder });
  } catch (err) {
    // ล็อกข้อผิดพลาดเพื่อการตรวจสอบ
    console.error("Error deleting order:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.createOrder = async (req, res, next) => {
  try {
    // ตรวจสอบข้อมูลที่ส่งเข้ามา
    const { error, value } = td_orderSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // ข้อมูลที่ตรวจสอบแล้วสามารถใช้งานได้
    const orderData = value;

    // ล็อกข้อมูลที่ต้องการเพิ่ม
    console.log("Order Data to be created:", orderData);

    const newOrder = await prisma.tD_Order.create({ data: orderData });

    // ตรวจสอบ Order_No และ Quantity
    if (!newOrder.Order_No) {
      return next(createError(404, "Order_No cannot be NULL"));
    }

    if (newOrder.Quantity === 0) {
      return next(createError(404, "Quantity cannot be 0"));
    }
    newOrder.Pd_Target_Qty = newOrder.Quantity;
    newOrder.NAV_Name = newOrder.Product_Name;

    return res
      .status(201)
      .json({ message: "Order created successfully", order: newOrder });
  } catch (err) {
    // ล็อกข้อผิดพลาดเพื่อการตรวจสอบ
    console.error("Error creating order:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.Product_Docu_Set = async (req, res, next) => {
  try {
    const { Order_No, Production_Docu_Drive } = req.body;

    // ตรวจสอบว่า Order_No และ Production_Docu_Drive มีค่าหรือไม่
    if (!Order_No || !Production_Docu_Drive) {
      return res
        .status(400)
        .json({ message: "Order_No and Production_Docu_Drive are required" });
    }

    // ล็อกข้อมูลที่ต้องการแก้ไข
    console.log("Data to be processed:", req.body);

    // คำนวณปีจาก Order_No
    const year = 2000 + parseInt(Order_No.slice(3, 5)); // ดึงปีจาก Order_No
    const productDocType = ".pdf"; // กำหนดประเภทเอกสาร (คุณสามารถปรับให้ดึงจากฐานข้อมูลได้)

    // สร้างเส้นทางเอกสาร
    const productDocPath = `#${Production_Docu_Drive}\\${year}\\${Order_No.slice(
      5,
      7
    )}\\${Order_No.slice(0, 3)}\\${Order_No}${productDocType}#`;

    // อัปเดตข้อมูลในฐานข้อมูล
    const updatedProduct = await prisma.tS_Set.update({
      where: { ID: 1 },
      data: {
        Product_Docu: productDocPath, // อัปเดตเส้นทางเอกสาร
        Product_Docu_Type: productDocType, // อัปเดตประเภทเอกสาร
      },
    });

    // ส่งคำตอบกลับ
    return res.status(200).json({
      message: "Product document updated successfully",
      order: updatedProduct,
    });
  } catch (err) {
    // ล็อกข้อผิดพลาดเพื่อการตรวจสอบ
    console.error("Error updating product document:", err);
    return next(createError(500, "Internal Server Error"));
  }
};
