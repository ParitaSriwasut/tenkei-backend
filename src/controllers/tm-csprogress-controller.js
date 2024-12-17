const createError = require("../utils/create-error");
const prisma = require("../models/prisma");


exports.fetchCsProgress = async (req, res, next) => {
    try {
        const CsProgress = await prisma.tM_Cs_Progress.findMany();
        return res.status(200).json({
            status: "success",
            data: {
                csprogress: CsProgress,
            },
        });
    } catch (err) {
        console.error("Error fetching CsProgress:", err);
        return next(createError(500, `Internal Server Error: ${err.message}`));
    }
};