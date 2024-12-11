const createError = require("../utils/create-error");
const prisma = require("../models/prisma");
const { td_costSchema } = require("../validators/cost-validator");

exports.Search_Parts_No_AfterUpdate = async (req, res, next) => {
  try {
    console.log("Request Body:", req.body);
    let { Order_No: orderNo, Parts_No: partsNO } = req.body;
    const OdPt_No = orderNo + partsNO;

    const Cost = await prisma.tD_Cost.findMany({
      where: { OdPt_No: OdPt_No },
    });
    return res.status(200).json({
      status: "success",
      data: {
        cost: Cost,
      },
    });
  } catch (err) {
    console.error("Error searching order:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.Search_Cost_No_AfterUpdate = async (req, res, next) => {
  try {
    console.log("Request Body:", req.body);
    let { Order_No: orderNo, Parts_No: partsNO, Cost_No: CostNo } = req.body;
    const OdPtCs_No = orderNo + partsNO + CostNo;

    const Cost = await prisma.tD_Cost.findFirst({
      where: { OdPtCs_No: OdPtCs_No },
    });
    return res.status(200).json({
      status: "success",
      data: {
        cost: Cost,
      },
    });
  } catch (err) {
    console.error("Error searching order:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.updateCost = async (req, res, next) => {
  try {
    // Step 1: Validate the incoming request data using Joi schema.
    const { error, value } = td_costSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const costData = value;

 

    // Step 3: Check if the record exists in TD_WIP if required
    if (costData.Cs_Progress_CD < "5") {
      // ตรวจสอบค่าของ Cs_Progress_CD ที่เป็นสตริง
      const existingRecord = await prisma.tD_WIP.findFirst({
        where: { OdPt_No: costData.OdPt_No },
      });
      if (!existingRecord) {
        return res.status(400).json({
          message: `This Order-Parts-No does not exist in TD_WIP. Please contact production control staff.`,
        });
      }
    }

    // Step 4: Check resource status when Cs_Progress_CD is "5"
    if (costData.Cs_Progress_CD === "5") {
      const resourceStatus = await prisma.tM_Resource.findUnique({
        where: { Resource_CD: costData.CMC },
      });

      if (!resourceStatus) {
        return res.status(400).json({
          message: `Resource with Resource_CD ${costData.CMC} not found.`,
        });
      }

      if (resourceStatus.End === -1) {
        return res.status(400).json({
          message: `Please re-register this Order-Parts-No at Plan Info, as it was deleted from TD_WIP.`,
        });
      }
    }

    // Step 5: Update records based on provided conditions
    const updatedCost = await prisma.tD_Cost.update({
      where: {
        Order_No_Parts_No_Cost_No: {
          Order_No: costData.Order_No,
          Parts_No: costData.Parts_No,
          Cost_No: costData.Cost_No,
        },
      },
      data: {
        ...costData,
        Cs_Complete_Date: costData.Cs_Progress_CD === "4" ? costData.CPD : null,
        Cs_Complete_Qty: costData.CPN || null,
        Cs_Progress_CD: costData.Cs_Progress_CD,
        Cs_Final_Complete: costData.Cs_Progress_CD === "4" ? true : false, // Boolean
        Cs_Modify_Date: new Date(),
        Sequence_No: costData.Sequence_No || (await prisma.tD_Cost.count()) + 1, // Generate Sequence_No if not present
      },
    });

    // Step 6: Send response
    return res
      .status(200)
      .json({ message: "cost updated successfully", cost: updatedCost });
  } catch (err) {
    console.error("Error updating Cost:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.createCost = async (req, res, next) => {
  try {
    // Step 1: Validate the incoming request data using Joi schema.
    const { error, value } = td_costSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const costData = value;

    // Step 2: Build composite keys based on order and parts numbers
    const OdPt_No = `${costData.Order_No}${costData.Parts_No}`;
    const OdPtCs_No = `${costData.Order_No}${costData.Parts_No}${costData.Cost_No}`;
    const OdPtPr_No = `${costData.Order_No}${costData.Parts_No}${costData.Process_No}`;

    // Step 3: Check if the record exists in TD_WIP if required
    if (costData.Cs_Progress_CD < "5") {
      const existingRecord = await prisma.tD_WIP.findFirst({
        where: { OdPt_No: costData.OdPt_No },
      });
      if (!existingRecord) {
        return res.status(400).json({
          message: `This Order-Parts-No does not exist in TD_WIP. Please contact production control staff.`,
        });
      }
    }


    if (costData.Cs_Progress_CD === "5") {
      const resourceStatus = await prisma.tM_Resource.findUnique({
        where: { Resource_CD: costData.CMC },
      });

      if (!resourceStatus) {
        return res.status(400).json({
          message: `Resource with Resource_CD ${costData.CMC} not found.`,
        });
      }

      if (resourceStatus.End === -1) {
        return res.status(400).json({
          message: `Please re-register this Order-Parts-No at Plan Info, as it was deleted from TD_WIP.`,
        });
      }
    }

    // Step 5: Create a new record in tD_Cost table
    const createdCost = await prisma.tD_Cost.create({
      data: {
        ...costData,
        OdPt_No:OdPt_No,
        OdPtCs_No:OdPtCs_No,
        OdPtPr_No:OdPtPr_No,
        Cs_Complete_Date: costData.Cs_Progress_CD === "4" ? costData.CPD : null,
        Cs_Complete_Qty: costData.CPN || null,
        Cs_Progress_CD: costData.Cs_Progress_CD,
        Cs_Final_Complete: costData.Cs_Progress_CD === "4" ? true : false, 
        Cs_Modify_Date: new Date(),
        Cs_Register_Date: new Date(),
        Sequence_No: costData.Sequence_No || (await prisma.tD_Cost.count()) + 1, 
      },
    });

    // Step 6: Send response
    return res
      .status(201)  // 201 is the status code for resource creation
      .json({ message: "Cost created successfully", cost: createdCost });
  } catch (err) {
    console.error("Error creating Cost:", err);
    return next(createError(500, "Internal Server Error"));
  }
};