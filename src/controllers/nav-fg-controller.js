const createError = require("../utils/create-error");
const prisma = require("../models/prisma");

exports.fetchNAVFG = async (req, res, next) => {
  try {
    const NAVFG = await prisma.tT_NAV_Od_FG.findMany();

    return res.status(200).json({
      status: "success",
      data: {
        NAVFG: NAVFG,
      },
    });
  } catch (err) {
    console.error("Error searching NAVFG:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.NoneFG = async (req, res, next) => {
  try {
    const result = await prisma.tD_Cost.findMany({
      include: {
        TD_Order: {
          include: {
            TT_NAV_Od_FG: true, // LEFT JOIN TT_NAV_Od_FG
          },
        },
      },
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

exports.NoneFGTENKEI = async (req, res, next) => {
  try {
    // ดึงผลลัพธ์จาก tD_Cost
    const results = await prisma.tD_Cost.findMany({
      where: {
        Cs_Progress_CD: "4",
        CMC: {
          not: null, // ตรวจสอบว่า CMC มีค่า
        },
        Cs_Complete_Date: {
          equals: new Date(), // ตรวจสอบวันที่การทำเสร็จสมบูรณ์
        },
      },
      include: {
        TM_Resource: {
          where: {
            CostG_CD: "QC-FG", // ตรวจสอบว่า CostG_CD เท่ากับ "QC-FG"
          },
        },
        TD_Order: true, // รวมข้อมูลจาก TD_Order
      },
    });

    // ดึงผลลัพธ์จาก tT_NAV_Od_FG
    const results2 = await prisma.tT_NAV_Od_FG.findMany({});

    // ทำ LEFT JOIN โดยการจับคู่ข้อมูลจาก results กับ results2
    const joinedResults = results.map((result) => {
      // หาข้อมูลที่ตรงกันใน results2 โดยใช้ Order_No
      const matchingResults2 = results2.filter(
        (result2) => result2.Order_No === result.Order_No
      );

      // เพิ่มข้อมูลจาก results2 ลงในผลลัพธ์ (หากไม่มีข้อมูลจะเป็นอาร์เรย์ว่าง)
      return {
        ...result,
        results2: matchingResults2.length > 0 ? matchingResults2 : null, // ถ้ามีข้อมูลตรงกัน จะรวมไว้, ถ้าไม่มีจะเป็น null
      };
    });

    return res.status(200).json({
      status: "success",
      data: {
        result: joinedResults,
      },
    });
  } catch (err) {
    console.error("Error searching NoneFGTENKEI:", err);
    return next(createError(500, "Internal Server Error"));
  }
};
