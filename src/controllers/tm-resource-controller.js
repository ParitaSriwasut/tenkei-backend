const createError = require("../utils/create-error");
const prisma = require("../models/prisma");
const { tm_resourceSchema } = require("../validators/resource-validator");


exports.fetchResource = async (req, res, next) => {
    try {
        const resource = await prisma.tM_Resource.findMany();
        return res.status(200).json({
            status: "success",
            data: {
                resource: resource,
            },
        });
    } catch (err) {
        console.error("Error fetching resource:", err);
        return next(createError(500, `Internal Server Error: ${err.message}`));
    }
};

exports.updateResource = async (req, res, next) => {
    try {
        // ตรวจสอบข้อมูล
        const { error, value } = tm_resourceSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // ข้อมูลที่ตรวจสอบแล้ว
        const resourceData = value;

        console.log("Resource Data to be updated:", resourceData);

        // อัปเดตข้อมูลในฐานข้อมูล
        const updateResource = await prisma.tM_Resource.update({
            where: { Resource_CD: resourceData.Resource_CD }, // ระบุเงื่อนไขการค้นหา
            data: {
                ...resourceData, // ข้อมูลที่ต้องการอัปเดต
            },
        });

        // ส่งคำตอบกลับ
        return res
            .status(200)
            .json({ message: "Resource updated successfully", resource: updateResource });
    } catch (err) {
        console.error("Error updating Resource:", err);
        return next(createError(500, "Internal Server Error"));
    }
};
