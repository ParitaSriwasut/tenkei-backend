const createError = require("../utils/create-error");
const prisma = require("../models/prisma");

exports.Show_action = async (req, res, next) => {
  try {
    const {
      S_Order_No,
      S_NAV_Name,
      S_NAV_Size,
      S_Product_Size,
      S_Customer_Draw,
      S_Company_Draw,
      S_Product_Draw,
      S_Sl_Instructions,
      S_Pd_Instructions,
      S_Pd_Remark,
      S_I_Remark,
      S_Price_CD,
      S_Customer_Name1,
      S_Customer_Name2,
      S_Customer_Name3,
      S_Od_No_of_Custom,
      S_Request1_CD,
      S_Request2_CD,
      S_Request3_CD,
      S_Material1,
      S_Material2,
      S_Item1_CD,
      S_Item2_CD,
      S_Item3_CD,
      S_Item4_CD,
      S_Od_Pending,
      S_Temp_Shipment,
      S_Unreceived,
      S_Od_CAT1,
      S_Od_CAT2,
      S_Od_CAT3,
      S_St_Delivery_CD,
      S_Ed_Delivery_CD,
      S_St_Schedule_CD,
      S_Ed_Schedule_CD,
      S_St_Target_CD,
      S_Ed_Target_CD,
      S_St_Request_Delivery,
      S_Ed_Request_Delivery,
      S_St_NAV_Delivery,
      S_Ed_NAV_Delivery,
      S_St_Confirm_Delivery,
      S_Ed_Confirm_Delivery,
      S_St_Pd_Received_Date,
      S_Ed_Pd_Received_Date,
      S_St_Pd_Complete_Date,
      S_St_I_Complete_Date,
      S_Ed_I_Complete_Date,
      S_St_Shipment_Date,
      S_Ed_Shipment_Date,
      S_St_Calc_Date,
      S_Ed_Calc_Date,
      S_Parts_No,
      S_Parts_Pending,
      S_Parts_CAT1,
      S_Parts_CAT2,
      S_Parts_CAT3,
      S_St_Parts_Delivery,
      S_Ed_Parts_Delivery,
      S_Parts_Material,
      S_Parts_Instructions,
      S_Parts_Remark,
      S_Parts_Information,
      S_St_Pl_Progress_CD,
      S_Ed_Pl_Progress_CD,
      S_Pl_Reg_Person_CD,
      Plan_Target,
      S_St_Pd_Grp_CD,
      S_Ed_Pd_Grp_CD,
      S_No_Pd_Grp_CD1,
      S_No_Pd_Grp_CD2,
      S_Customer_CD1,
      S_Customer_CD2,
      S_Customer_CD3,
      S_No_Customer_CD,
      S_Product_Name,
      S_Sl_Grp_CD,
      S_Sl_Person_CD,
      S_Coating_CD1,
      S_Coating_CD2,
      S_Coating_CD3,
      S_No_Coating_CD,
      S_Specific_CD1,
      S_Specific_CD2,
      S_No_Specific_CD1,
      S_No_Specific_CD2,
      S_St_Od_Progress_CD,
      S_Ed_Od_Progress_CD,
      S_Od_Ctl_Person_CD,
      S_St_Product_Delivery,
      S_Ed_Product_Delivery,
      S_St_Complete_Date,
      S_Ed_Complete_Date,
      S_St_Process_Date,
      S_Ed_Process_Date,
    } = req.body;
    console.log("Request Body:", req.body);
    const orders = await prisma.tD_Order.findMany({
      where: {
        Plan: {
          some: {
            Parts_No: {
              contains: S_Parts_No || "",
            },
            Pt_Material: {
              contains: S_Parts_Material || "",
            },
            OR: [
              {
                Pl_Progress_CD: {
                  gte: S_St_Pl_Progress_CD || "0",
                },
              },
              {
                Pl_Progress_CD: {
                  lte: S_Ed_Pl_Progress_CD || "0",
                },
              },
            ],
            Pt_Instructions: {
              contains: S_Parts_Instructions || "",
            },
            Pt_Remark: {
              contains: S_Parts_Remark || "",
            },
            Pt_Information: {
              contains: S_Parts_Information || "",
            },
            Pl_Reg_Person_CD: {
              contains: S_Pl_Reg_Person_CD || "",
            },
            OR: [
              {
                Pt_Delivery: {
                  equals: S_St_Parts_Delivery
                    ? new Date(S_St_Parts_Delivery)
                    : undefined,
                },
              },
              {
                Pt_Delivery: {
                  gte: S_St_Parts_Delivery
                    ? new Date(S_St_Parts_Delivery)
                    : new Date("1970-01-01"),
                  lte: S_Ed_Parts_Delivery
                    ? new Date(S_Ed_Parts_Delivery)
                    : new Date("9999-12-31"),
                },
              },
            ],
         
            costs: {
              some: {
                CPD: {
                  gte: S_St_Process_Date
                    ? new Date(S_St_Process_Date)
                    : new Date("1970-01-01"), 
                  lte: S_Ed_Process_Date
                    ? new Date(S_Ed_Process_Date)
                    : new Date("9999-12-31"), 
                },
              },
            },
            
            Pt_CAT1:
              S_Parts_CAT1 === "Yes"
                ? true
                : S_Parts_CAT1 === "No"
                ? false
                : undefined,
            Pt_CAT2:
              S_Parts_CAT2 === "Yes"
                ? true
                : S_Parts_CAT2 === "No"
                ? false
                : undefined,
            Pt_CAT3:
              S_Parts_CAT3 === "Yes"
                ? true
                : S_Parts_CAT3 === "No"
                ? false
                : undefined,
            Pt_Pending:
              S_Parts_Pending === "Yes"
                ? true
                : S_Parts_Pending === "No"
                ? false
                : undefined,
            Pl_Object:
              Plan_Target === "Yes"
                ? true
                : Plan_Target === "No"
                ? false
                : undefined,
            Order_No: {
              contains: S_Order_No || "",
            },
          },
        },
        AND: [
          S_St_Pd_Grp_CD === null || {
            Product_Grp_CD: {
              contains: S_St_Pd_Grp_CD || "",
            },
          },
        ],
        OR: [
          {
            Product_Grp_CD: {
              gte: S_St_Pd_Grp_CD || "0",
            },
          },
          {
            Product_Grp_CD: {
              lte: S_Ed_Pd_Grp_CD || "999999",
            },
          },
        ],
        AND: [
          {
            OR: [
              S_No_Pd_Grp_CD1 === null || {
                Product_Grp_CD: S_No_Pd_Grp_CD1,
              },
              {
                AND: [
                  {
                    Product_Grp_CD: { not: S_No_Pd_Grp_CD1 },
                  },
                  {
                    Product_Grp_CD: { not: S_No_Pd_Grp_CD2 },
                  },
                ],
              },
            ],
          },
        ],
        AND: [
          {
            OR: [
              S_Customer_CD1 === null || {
                Customer_CD: S_Customer_CD1,
              },

              S_Customer_CD2 === null || {
                Customer_CD: S_Customer_CD2,
              },

              S_Customer_CD2 !== null && {
                OR: [
                  {
                    Customer_CD: S_Customer_CD1,
                  },
                  {
                    Customer_CD: S_Customer_CD2,
                  },
                ],
              },

              S_Customer_CD3 === null || {
                OR: [
                  {
                    Customer_CD: S_Customer_CD1,
                  },
                  {
                    Customer_CD: S_Customer_CD2,
                  },
                  {
                    Customer_CD: S_Customer_CD3,
                  },
                ],
              },
            ],
          },
          {
            Customer_CD: {
              not: S_No_Customer_CD || undefined,
            },
          },
        ],

        AND: [
          {
            TM_Customer: {
              AND: [
                S_Customer_Name1 === null || {
                  Customer_Abb: {
                    contains: S_Customer_Name1,
                  },
                },
                S_Customer_Name2 === null || {
                  Customer_Abb: {
                    contains: S_Customer_Name2,
                  },
                },
                S_Customer_Name3 === null || {
                  Customer_Abb: {
                    contains: S_Customer_Name3,
                  },
                },
              ],
            },
          },
        ],
        AND: [
          {
            NAV_Name: {
              contains: S_NAV_Name || "",
            },
          },
        ],
        AND: [
          {
            Product_Name: {
              contains: S_Product_Name || "",
            },
          },
        ],
        AND: [
          {
            NAV_Size: {
              contains: S_NAV_Size || "",
            },
          },
        ],

        AND: [
          {
            Product_Size: {
              contains: S_Product_Size || "",
            },
          },
        ],
        AND: [
          {
            Customer_Draw: {
              contains: S_Customer_Draw || "",
            },
          },
        ],

        AND: [
          {
            Company_Draw: {
              contains: S_Company_Draw || "",
            },
          },
        ],

        AND: [
          {
            Product_Draw: {
              contains: S_Product_Draw || "",
            },
          },
        ],
        AND: [
          {
            Sales_Grp_CD: {
              contains: S_Sl_Grp_CD || "",
            },
          },
        ],
        AND: [
          {
            Sales_Person_CD: {
              contains: S_Sl_Person_CD || "",
            },
          },
        ],
        AND: [
          {
            Request1_CD: {
              contains: S_Request1_CD || "",
            },
          },
        ],
        AND: [
          {
            Request2_CD: {
              contains: S_Request2_CD || "",
            },
          },
        ],
        AND: [
          {
            Request3_CD: {
              contains: S_Request3_CD || "",
            },
          },
        ],
        AND: [
          {
            Material1: {
              contains: S_Material1 || "",
            },
          },
          {
            Material2: {
              contains: S_Material2 || "",
            },
          },
        ],
        AND: [
          {
            OR: [
              S_Coating_CD1 === null || {
                Coating_CD: S_Coating_CD1,
              },

              S_Coating_CD2 === null || {
                Coating_CD: S_Coating_CD1,
              },

              S_Coating_CD3 === null || {
                OR: [
                  {
                    Coating_CD: S_Coating_CD1,
                  },
                  {
                    Coating_CD: S_Coating_CD2,
                  },
                ],
              },

              {
                OR: [
                  {
                    Coating_CD: S_Coating_CD1,
                  },
                  {
                    Coating_CD: S_Coating_CD2,
                  },
                  {
                    Coating_CD: S_Coating_CD3,
                  },
                ],
              },
            ],
          },

          S_No_Coating_CD === null || {
            NOT: {
              Coating_CD: S_No_Coating_CD,
            },
          },
        ],
        AND: [
          {
            Item1_CD: {
              contains: S_Item1_CD || "",
            },
            Item2_CD: {
              contains: S_Item2_CD || "",
            },
            Item3_CD: {
              contains: S_Item3_CD || "",
            },
            Item4_CD: {
              contains: S_Item4_CD || "",
            },
          },
        ],
        AND: [
          {
            Od_No_of_Custom: {
              contains: S_Od_No_of_Custom || "",
            },
          },
        ],
        AND: [
          {
            Price_CD: {
              contains: S_Price_CD || "",
            },
          },
        ],
        AND: [
          {
            OR: [
              S_Specific_CD1 === null || {
                Specific_CD: S_Specific_CD1,
              },

              S_Specific_CD2 === null || {
                Specific_CD: S_Specific_CD1,
              },

              S_Specific_CD1 !== null &&
                S_Specific_CD2 !== null && {
                  OR: [
                    {
                      Specific_CD: S_Specific_CD1,
                    },
                    {
                      Specific_CD: S_Specific_CD2,
                    },
                  ],
                },
            ],
          },
        ],
        AND: [
          S_No_Specific_CD1 === null || {
            Specific_CD: {
              not: S_No_Specific_CD1,
            },
          },
          S_No_Specific_CD2 === null || {
            Specific_CD: {
              not: S_No_Specific_CD2,
            },
          },
        ],
        AND: [
          {
            OR: [
              S_St_Od_Progress_CD === null || {
                Od_Progress_CD: {
                  contains: S_St_Od_Progress_CD,
                },
              },

              S_St_Od_Progress_CD !== null &&
                S_Ed_Od_Progress_CD !== null && {
                  Od_Progress_CD: {
                    gte: S_St_Od_Progress_CD,
                    lte: S_Ed_Od_Progress_CD,
                  },
                },
            ],
          },
        ],
        AND: [
          {
            OR: [
              S_St_Delivery_CD === null || {
                Delivery_CD: {
                  contains: S_St_Delivery_CD,
                },
              },

              S_St_Delivery_CD !== null &&
                S_Ed_Delivery_CD !== null && {
                  Delivery_CD: {
                    gte: S_St_Delivery_CD,
                    lte: S_Ed_Delivery_CD,
                  },
                },
            ],
          },
        ],
        AND: [
          {
            OR: [
              S_St_Schedule_CD === null || {
                Schedule_CD: {
                  contains: S_St_Schedule_CD,
                },
              },

              S_St_Schedule_CD !== null &&
                S_Ed_Schedule_CD !== null && {
                  Schedule_CD: {
                    gte: S_St_Schedule_CD,
                    lte: S_Ed_Schedule_CD,
                  },
                },
            ],
          },
        ],
        AND: [
          {
            OR: [
              S_St_Target_CD === null || {
                Target_CD: {
                  contains: S_St_Target_CD,
                },
              },

              S_St_Target_CD !== null &&
                S_Ed_Target_CD !== null && {
                  Target_CD: {
                    gte: S_St_Target_CD || "0",
                    lte: S_Ed_Target_CD || "9",
                  },
                },
            ],
          },
        ],
        AND: [
          {
            Sl_Instructions: {
              contains: S_Sl_Instructions || "",
            },
            Pd_Instructions: {
              contains: S_Pd_Instructions || "",
            },
            Pd_Remark: {
              contains: S_Pd_Remark || "",
            },
            I_Remark: {
              contains: S_I_Remark || "",
            },
            Od_Ctl_Person_CD: {
              contains: S_Od_Ctl_Person_CD || "",
            },
          },
        ],
        AND: [
          {
            OR: [
              S_St_Request_Delivery === null || {
                Request_Delivery: S_St_Request_Delivery,
              },

              S_St_Request_Delivery !== null &&
                S_Ed_Request_Delivery !== null && {
                  Request_Delivery: {
                    gte: S_St_Request_Delivery
                      ? new Date(S_St_Request_Delivery)
                      : new Date("1970-01-01"),
                    lte: S_Ed_Request_Delivery
                      ? new Date(S_Ed_Request_Delivery)
                      : new Date("9999-12-31"),
                  },
                },
            ],
          },
        ],
        AND: [
          {
            OR: [
              S_St_NAV_Delivery === null || {
                NAV_Delivery: S_St_NAV_Delivery,
              },

              S_St_NAV_Delivery !== null &&
                S_Ed_NAV_Delivery !== null && {
                  NAV_Delivery: {
                    gte: S_St_NAV_Delivery,

                    lte: S_Ed_NAV_Delivery,
                  },
                },
            ],
          },
        ],
        AND: [
          {
            OR: [
              S_St_Confirm_Delivery === null || {
                Confirm_Delivery: S_St_Confirm_Delivery,
              },

              S_St_Confirm_Delivery !== null &&
                S_Ed_Confirm_Delivery !== null && {
                  Confirm_Delivery: {
                    gte: S_St_Confirm_Delivery,
                    lte: S_Ed_Confirm_Delivery,
                  },
                },
            ],
          },
        ],
        AND: [
          {
            OR: [
              S_St_Product_Delivery === null || {
                Product_Delivery: S_St_Product_Delivery,
              },

              S_St_Product_Delivery !== null &&
                S_Ed_Product_Delivery !== null && {
                  Product_Delivery: {
                    gte: S_St_Product_Delivery,
                    lte: S_Ed_Product_Delivery,
                  },
                },
            ],
          },
        ],
        AND: [
          {
            OR: [
              S_St_Pd_Received_Date === null || {
                Pd_Received_Date: S_St_Pd_Received_Date,
              },

              S_St_Pd_Received_Date !== null &&
                S_Ed_Pd_Received_Date !== null && {
                  Pd_Received_Date: {
                    gte: S_St_Pd_Received_Date,
                    lte: S_Ed_Pd_Received_Date,
                  },
                },
            ],
          },
        ],
        AND: [
          {
            OR: [
              S_St_Pd_Complete_Date === null || {
                Pd_Complete_Date: S_St_Pd_Complete_Date,
              },

              S_St_Pd_Complete_Date !== null && {
                Pd_Complete_Date: {
                  gte: S_St_Pd_Complete_Date,
                  lte: S_St_Pd_Complete_Date,
                },
              },
            ],
          },
        ],
        AND: [
          {
            OR: [
              S_St_I_Complete_Date === null || {
                I_Completed_Date: S_St_I_Complete_Date,
              },

              S_St_I_Complete_Date !== null &&
                S_Ed_I_Complete_Date !== null && {
                  I_Completed_Date: {
                    gte: S_St_I_Complete_Date,
                    lte: S_Ed_I_Complete_Date,
                  },
                },
            ],
          },
        ],
        AND: [
          {
            OR: [
              S_St_Shipment_Date === null || {
                Shipment_Date: S_St_Shipment_Date,
              },

              S_St_Shipment_Date !== null &&
                S_Ed_Shipment_Date !== null && {
                  Shipment_Date: {
                    gte: S_St_Shipment_Date,
                    lte: S_Ed_Shipment_Date,
                  },
                },
            ],
          },
        ],
        AND: [
          {
            OR: [
              S_St_Calc_Date === null || {
                Pd_Calc_Date: S_St_Calc_Date,
              },

              S_St_Calc_Date !== null &&
                S_Ed_Calc_Date !== null && {
                  Pd_Calc_Date: {
                    gte: S_St_Calc_Date,
                    lte: S_Ed_Calc_Date,
                  },
                },
            ],
          },
        ],
        AND: [
          {
            Od_CAT1:
              S_Od_CAT1 === "Yes"
                ? true
                : S_Od_CAT1 === "No"
                ? false
                : undefined,
            Od_CAT2:
              S_Od_CAT2 === "Yes"
                ? true
                : S_Od_CAT2 === "No"
                ? false
                : undefined,
            Od_CAT3:
              S_Od_CAT3 === "Yes"
                ? true
                : S_Od_CAT3 === "No"
                ? false
                : undefined,
            Od_Pending:
              S_Od_Pending === "Yes"
                ? true
                : S_Od_Pending === "No"
                ? false
                : undefined,
            Temp_Shipment:
              S_Temp_Shipment === "Yes"
                ? true
                : S_Temp_Shipment === "No"
                ? false
                : undefined,
            Unreceived:
              S_Unreceived === "Yes"
                ? true
                : S_Unreceived === "No"
                ? false
                : undefined,
          },
        ],
        AND: [
          {
            Plan: {
              some: {
                costs: {
                  some: {
                    Cs_Complete_Date: {
                      gte: S_St_Complete_Date
                        ? new Date(S_St_Complete_Date)
                        : new Date("1970-01-01"),
                      lte: S_Ed_Complete_Date
                        ? new Date(S_Ed_Complete_Date)
                        : new Date("9999-12-31"),
                    },
                  },
                },
              },
            },
          },
        ],
      },
      include: {
        TM_WorkG: true,
        TM_Customer: true,
        Plan: {
          include: {
            costs: true,
            Result: true,
            schedule: true,
          },
        },
      },
    });

    return res.json(orders);
  } catch (err) {
    console.error("Error searching orders:", err);
    return next(createError(500, "Internal Server Error"));
  }
};
