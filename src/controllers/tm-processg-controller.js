const createError = require("../utils/create-error");
const prisma = require("../models/prisma");
const { tm_processgSchema } = require("../validators/processg-validator");

exports.fetchProcessG = async (req, res, next) => {
    try {

        const processg = await prisma.tM_ProcessG.findMany();

        // ส่งข้อมูลทั้งหมดกลับไปยังผู้ใช้
        return res.status(200).json({
            status: "success",
            data: {
                processg: processg,
            },
        });
    } catch (err) {
        console.error("Error searching processG:", err);
        return next(createError(500, "Internal Server Error"));
    }
};

exports.updateProcessg = async (req, res, next) => {
    try {
        // ตรวจสอบข้อมูล
        const { error, value } = tm_processgSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // ข้อมูลที่ตรวจสอบแล้ว
        const processgData = value;

        console.log("Processg Data to be updated:", processgData);

        // อัปเดตข้อมูลในฐานข้อมูล
        const updateProcessg = await prisma.tM_ProcessG.update({
            where: { ProcessG_CD: processgData.ProcessG_CD }, // ระบุเงื่อนไขการค้นหา
            data: {
                ...processgData, // ข้อมูลที่ต้องการอัปเดต
            },
        });

        // ส่งคำตอบกลับ
        return res
            .status(200)
            .json({ message: "ProcessG updated successfully", processg: updateProcessg });
    } catch (err) {
        console.error("Error updating ProcessG:", err);
        return next(createError(500, "Internal Server Error"));
    }
};