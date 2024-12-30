const createError = require("../utils/create-error")
const prisma = require("../models/prisma")
const { td_planSchema } = require("../validators/plan-validator")

exports.get_short_customer_info = async (req, res, next) => {
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

exports.Search_Order_No_AfterUpdate = async (req, res, next) => {
    try {
        // ล็อกข้อมูลที่รับเข้ามา
        console.log("Request Body:", req.body)

        let { Order_No: orderNo } = req.body // ใช้ destructuring เพื่อดึง Order_No

        // ตรวจสอบว่า orderNo เป็นสตริงและมีความยาวที่เหมาะสม
        if (typeof orderNo !== "string" || orderNo.length < 10) {
            return next(
                createError(
                    400,
                    "Order number is required and must be at least 10 characters long"
                )
            )
        }

        // กำหนดตัวแปร SON (ใช้ในกรณีที่ OrderNo มีความยาว 12)
        let SON = 0

        // ตรวจสอบความยาวของหมายเลขคำสั่งซื้อ
        if (orderNo.length === 12) {
            SON = orderNo
            orderNo = orderNo.substring(0, 10) // ตัดหมายเลขคำสั่งซื้อเหลือ 10 ตัวอักษร
        }

        // ค้นหาในฐานข้อมูลโดยใช้ Prisma (จอยตาราง TD_Plan)
        const partsNo = await prisma.tD_Plan.findMany({
            where: { Order_No: orderNo },
        })

        // ส่งข้อมูลหมายเลขคำสั่งซื้อกลับไปยังผู้ใช้
        return res.status(200).json({
            status: "success",
            data: {
                partsNo: partsNo,
            },
        })
    } catch (err) {
        console.error("Error searching partsNo:", err)
        return next(createError(500, "Internal Server Error"))
    }
}

exports.deletePlan = async (req, res, next) => {
    try {
        const { Order_No, Parts_No } = req.body
        const OdPt_No = `${Order_No}${Parts_No}`

        const existingPlan = await prisma.tD_Plan.findFirst({
            where: {
                OdPt_No: OdPt_No,
            },
        })

        if (existingPlan) {
            const deletedPlan = await prisma.tD_Plan.delete({
                where: {
                    Order_No_Parts_No: {
                        Order_No,
                        Parts_No,
                    },
                },
            })

            return res.status(200).json({
                message: "Plan deleted successfully",
                deletedPlan,
            })
        } else {
            return res.status(404).json({
                message: "Plan not found",
            })
        }
    } catch (err) {
        console.error("Error deleting Plan:", err)
        return next(createError(500, "Internal Server Error"))
    } finally {
        await prisma.$disconnect()
    }
}
