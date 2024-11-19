const createError = require("../utils/create-error");
const prisma = require("../models/prisma");

exports.Show_action = async (req, res, next) => {
  try {
    const {
      S_St_Calc_Process_Date,
      S_Ed_Calc_Process_Date,
      S_Order_No,
      S_NAV_Name,
      S_Product_Name,
      S_NAV_Size,
      S_Product_Size,
      S_Customer_Draw,
      S_Company_Draw,
      S_Product_Draw,
      S_Sl_Instructions,
      S_Pd_Instructions,
      S_Pd_Remark,
      S_I_Remark,
      S_St_Pd_Grp_CD,
      S_Ed_Pd_Grp_CD,
      S_No_Pd_Grp_CD1,
      S_No_Pd_Grp_CD2,
      S_Price_CD,
      S_Customer_CD1,
      S_Customer_CD2,
      S_Customer_CD3,
      S_No_Customer_CD,
      S_Customer_Name1,
      S_Customer_Name2,
      S_Customer_Name3,
      S_Specific_CD1,
      S_Specific_CD2,
      S_No_Specific_CD1,
      S_No_Specific_CD2,
      S_Coating_CD1,
      S_Coating_CD2,
      S_Coating_CD3,
      S_No_Coating_CD,
      S_Od_Ctl_Person_CD,
      S_Sl_Grp_CD,
      S_Sl_Person_CD,
      S_Request1_CD,
      S_Request2_CD,
      S_Request3_CD,
      S_Od_No_of_Custom,
      S_Item1_CD,
      S_Item2_CD,
      S_Item3_CD,
      S_Item4_CD,
      S_Material1,
      S_Material2,
      S_Material3,
      S_Material4,
      S_Material5,
      S_Od_Pending,
      S_Temp_Shipment,
      S_Unreceived,
      S_Od_CAT1,
      S_Od_CAT2,
      S_Od_CAT3,
      S_St_Od_Progress_CD,
      S_Ed_Od_Progress_CD,
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
      S_St_Product_Delivery,
      S_Ed_Product_Delivery,
      S_St_Pd_Received_Date,
      S_Ed_Pd_Received_Date,
      S_St_Pd_Complete_Date,
      S_Ed_Pd_Complete_Date,
      S_St_I_Complete_Date,
      S_Ed_I_Complete_Date,
      S_St_Shipment_Date,
      S_Ed_Shipment_Date,
      S_St_Calc_Date,
      S_Ed_Calc_Date,
      Plan_Target,
    } = req.body;
    console.log("Request Body:", req.body);

    const orders = await prisma.tD_Order.findMany({
      where: {
        AND: [
          {
            Calc_Process_Date: {
              gte: S_St_Calc_Process_Date
                ? new Date(S_St_Calc_Process_Date)
                : undefined,
              lte: S_Ed_Calc_Process_Date
                ? new Date(S_Ed_Calc_Process_Date)
                : undefined,
            },
          },
          {
            Order_No: {
              contains: S_Order_No || "", // ใช้ `contains` แทน `LIKE` ใน SQL
            },
          },
          {
            NAV_Name: {
              contains: S_NAV_Name || "", // ใช้ `contains` แทน `LIKE`
            },
          },
          {
            Product_Name: {
              contains: S_Product_Name || "", // ใช้ `contains` แทน `LIKE`
            },
          },
          {
            NAV_Size: {
              contains: S_NAV_Size || "", // ใช้ `contains` แทน `LIKE`
            },
          },
          {
            Product_Size: {
              contains: S_Product_Size || "", // ใช้ `contains` แทน `LIKE`
            },
          },
          {
            Customer_Draw: {
              contains: S_Customer_Draw || "", // ใช้ `contains` แทน `LIKE`
            },
          },
          {
            Company_Draw: {
              contains: S_Company_Draw || "", // ใช้ `contains` แทน `LIKE`
            },
          },
          {
            Product_Draw: {
              contains: S_Product_Draw || "", // ใช้ `contains` แทน `LIKE`
            },
          },
          {
            Sl_Instructions: {
              contains: S_Sl_Instructions || "", // ใช้ `contains` แทน `LIKE`
            },
          },
          {
            Pd_Instructions: {
              contains: S_Pd_Instructions || "", // ใช้ `contains` แทน `LIKE`
            },
          },
          {
            Pd_Remark: {
              contains: S_Pd_Remark || "", // ใช้ `contains` แทน `LIKE`
            },
          },
          {
            I_Remark: {
              contains: S_I_Remark || "", // ใช้ `contains` แทน `LIKE`
            },
          },

          {
            OR: [
              {
                Product_Grp_CD: {
                  gte: S_St_Pd_Grp_CD || "",
                },
              },
              {
                Product_Grp_CD: {
                  gte: S_St_Pd_Grp_CD || "", // เช็คว่า Product_Grp_CD มีค่าตรงกับ S_St_Pd_Grp_CD
                  lte: S_Ed_Pd_Grp_CD || "",
                },
              },
              {
                Product_Grp_CD: {
                  lte: S_St_Pd_Grp_CD || "", // เช็คว่า Product_Grp_CD มีค่าตรงกับ S_St_Pd_Grp_CD
                  gte: S_Ed_Pd_Grp_CD || "",
                },
              },
            ],
          },

          {
            // ตรวจสอบ Product_Grp_CD ว่ามีค่าไม่ตรงกับ S_No_Pd_Grp_CD1 หรือ S_No_Pd_Grp_CD2
            OR: [
              {
                Product_Grp_CD: {
                  not: S_No_Pd_Grp_CD1 || "", // ตรวจสอบว่า Product_Grp_CD ไม่ตรงกับ S_No_Pd_Grp_CD1
                },
              },
              {
                Product_Grp_CD: {
                  not: S_No_Pd_Grp_CD2 || "", // ตรวจสอบว่า Product_Grp_CD ไม่ตรงกับ S_No_Pd_Grp_CD2
                },
              },
            ],
          },

          {
            Price_CD: {
              contains: S_Price_CD, // ใช้ `contains` แทน `LIKE`
            },
          },

          {
            // ตรวจสอบว่า Customer_CD ตรงกับ S_Customer_CD1, S_Customer_CD2, หรือ S_Customer_CD3
            OR: [
              {
                Customer_CD: S_Customer_CD1 || undefined,
              },
              {
                Customer_CD: S_Customer_CD2 || undefined,
              },
              {
                Customer_CD: S_Customer_CD3 || undefined,
              },
            ],
          },
          {
            // ตรวจสอบว่า Customer_CD ไม่ตรงกับ S_No_Customer_CD
            NOT: {
              Customer_CD: S_No_Customer_CD || undefined,
            },
          },

          {
            OR: [
              {
                
                Customer_CD: S_Customer_CD1 || undefined,
                TM_Customer: {
                  Customer_Abb: {
                    contains: S_Customer_Name1 ? S_Customer_Name1 : "", // ใช้ S_Customer_Name1 ถ้ามี
                  },
                },
              
            },
              {
                OR: [
                  {
                    TM_Customer: {
                      Customer_Abb: {
                        contains: S_Customer_Name2 ? S_Customer_Name2 : "", // ใช้ S_Customer_Name2 ถ้ามี
                      },
                    },
                  },
                  {
                    TM_Customer: {
                      Customer_Abb: {
                        contains: S_Customer_Name3 ? S_Customer_Name3 : "", // ใช้ S_Customer_Name3 ถ้ามี
                      },
                    },
                  },
                ],
              },
            ],
          },

          {
            OR: [
              { Specific_CD: S_Specific_CD1 || undefined },
              { Specific_CD: S_Specific_CD2 || undefined },
            ],
          },
          // เงื่อนไขที่สอง: การตรวจสอบ S_No_Specific_CD
          {
            AND: [
              { NOT: { Specific_CD: S_No_Specific_CD1 || undefined } },
              { NOT: { Specific_CD: S_No_Specific_CD2 || undefined } },
            ],
          },

          {
            OR: [
              { Coating_CD: S_Coating_CD1 || undefined },
              { Coating_CD: S_Coating_CD2 || undefined },
              { Coating_CD: S_Coating_CD3 || undefined },
            ],
          },

          {
            NOT: { Coating_CD: S_No_Coating_CD || undefined }, // ค่า Coating_CD ไม่เท่ากับ S_No_Coating_CD
          },

          {
            Od_Ctl_Person_CD: {
              contains: S_Od_Ctl_Person_CD || "", // Matching pattern
            },
          },

          {
            Sales_Grp_CD: {
              contains: S_Sl_Grp_CD || "",
            },
          },
          {
            Sales_Person_CD: {
              contains: S_Sl_Person_CD || "",
            },
          },
          {
            Request1_CD: {
              contains: S_Request1_CD || "",
            },
          },
          {
            Request2_CD: {
              contains: S_Request2_CD || "",
            },
          },
          {
            Request3_CD: {
              contains: S_Request3_CD || "",
            },
          },
          {
            Od_No_of_Custom: {
              contains: S_Od_No_of_Custom || "",
            },
          },
          {
            Item1_CD: {
              contains: S_Item1_CD 
            },
          },
          {
            Item2_CD: {
              contains: S_Item2_CD 
            },
          },
          {
            Item3_CD: {
              contains: S_Item3_CD
            },
          },
          {
            Item4_CD: {
              contains: S_Item4_CD 
            },
          },

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
          {
            Material3: {
              contains: S_Material3 || "",
            },
          },
          {
            Material4: {
              contains: S_Material4 || "",
            },
          },
          {
            Material5: {
              contains: S_Material5 || "",
            },
          },

          {
            Od_Pending: {
              equals: S_Od_Pending , 
            },
          },
          {
            Temp_Shipment: {
              equals: S_Temp_Shipment,
            },
          },
          {
            Unreceived: {
              equals: S_Unreceived,
            },
          },
          {
            Od_CAT1: {
              equals: S_Od_CAT1 ,
            },
          },
          {
            Od_CAT2: {
              equals: S_Od_CAT2 ,
            },
          },
          {
            Od_CAT3: {
              equals: S_Od_CAT3 ,
            },
          },

          {
            OR: [
              {
                Od_Progress_CD: S_St_Od_Progress_CD || "" , // ตรวจสอบค่าเดียว
              },
              {
                Od_Progress_CD: {
                  gte: S_St_Od_Progress_CD ? String(S_St_Od_Progress_CD) : "0", // แปลงเป็น String
                  lte: S_Ed_Od_Progress_CD ? String(S_Ed_Od_Progress_CD) : "9",
                },
              },
            ],
          },
          {
            OR: [
              {
                Delivery_CD: S_St_Delivery_CD || "" ,
              },
              {
                Delivery_CD: {
                  gte: S_St_Delivery_CD ? String(S_St_Delivery_CD) : "0",
                  lte: S_Ed_Delivery_CD ? String(S_Ed_Delivery_CD) : "9",
                },
              },
            ],
          },
          {
            OR: [
              {
                Schedule_CD: S_St_Schedule_CD || "",
              },
              {
                Schedule_CD: {
                  gte: S_St_Schedule_CD ? String(S_St_Schedule_CD) : "0",
                  lte: S_Ed_Schedule_CD ? String(S_Ed_Schedule_CD) : "9",
                },
              },
            ],
          },
          {
            OR: [
              {
                Target_CD: S_St_Target_CD || "",
              },
              {
                Target_CD: {
                  gte: S_St_Target_CD ? String(S_St_Target_CD) : "0",
                  lte: S_Ed_Target_CD ? String(S_Ed_Target_CD) : "9",
                },
              },
            ],
          },

          {
            OR: [
              { Request_Delivery: S_St_Request_Delivery || undefined || null  }, // กรณีค่าเดียว
              {
                Request_Delivery: {
                  gte: S_St_Request_Delivery ? new Date(S_St_Request_Delivery) : new Date("0000-01-01"),
                  lte: S_Ed_Request_Delivery ? new Date(S_Ed_Request_Delivery) : new Date("9999-12-31"),
                },
              },
            ],
          },

          {
            OR: [
              { NAV_Delivery: S_St_NAV_Delivery || undefined || null  },
              {
                NAV_Delivery: {
                  gte: S_St_NAV_Delivery ? new Date(S_St_NAV_Delivery) : new Date("0000-01-01"),
                  lte: S_Ed_NAV_Delivery ? new Date(S_Ed_NAV_Delivery) : new Date("9999-12-31"),
                },
              },
            ],
          },

          {
            OR: [
              { Confirm_Delivery: S_St_Confirm_Delivery || undefined || null  },
              {
                Confirm_Delivery: {
                  gte: S_St_Confirm_Delivery ? new Date(S_St_Confirm_Delivery) : new Date("0000-01-01"),
                  lte: S_Ed_Confirm_Delivery ? new Date(S_Ed_Confirm_Delivery) : new Date("9999-12-31"),
                },
              },
            ],
          },

          {
            OR: [
              { Product_Delivery: S_St_Product_Delivery || undefined || null  },
              {
                Product_Delivery: {
                  gte: S_St_Product_Delivery ? new Date(S_St_Product_Delivery) : new Date("0000-01-01"),
                  lte: S_Ed_Product_Delivery ? new Date(S_Ed_Product_Delivery) : new Date("9999-12-31"),
                },
              },
            ],
          },

          {
            OR: [
              { Pd_Received_Date: S_St_Product_Delivery || undefined || null  },
              {
                Pd_Received_Date: {
                  gte: S_St_Pd_Received_Date ? new Date(S_St_Pd_Received_Date) : new Date("0000-01-01"),
                  lte: S_Ed_Pd_Received_Date ? new Date(S_Ed_Pd_Received_Date) : new Date("9999-12-31"),
                },
              },
            ],
          },

          {
            OR: [
              { Pd_Complete_Date: S_St_Pd_Complete_Date || undefined || null  },
              {
                Pd_Complete_Date: {
                  gte: S_St_Pd_Complete_Date ? new Date(S_St_Pd_Complete_Date) : new Date("0000-01-01"),
                  lte: S_Ed_Pd_Complete_Date ? new Date(S_Ed_Pd_Complete_Date) : new Date("9999-12-31"),
                },
              },
            ],
          },

          {
            OR: [
              { I_Completed_Date: S_St_I_Complete_Date || undefined || null  },
              {
                I_Completed_Date: {
                  gte: S_St_I_Complete_Date ? new Date(S_St_I_Complete_Date) : new Date("0000-01-01"),
                  lte: S_Ed_I_Complete_Date ? new Date(S_Ed_I_Complete_Date) : new Date("9999-12-31"),
                },
              },
            ],
          },

          {
            OR: [
              { Shipment_Date: S_St_Shipment_Date || undefined || null  },
              {
                Shipment_Date: {
                  gte: S_St_Shipment_Date ? new Date(S_St_Shipment_Date) : new Date("0000-01-01"),
                  lte: S_Ed_Shipment_Date ? new Date(S_Ed_Shipment_Date) : new Date("9999-12-31"),
                },
              },
            ],
          },

          {
            OR: [
              { Pd_Calc_Date: S_St_Calc_Date || undefined || null  },
              {
                Pd_Calc_Date: {
                  gte: S_St_Calc_Date ? new Date(S_St_Calc_Date) : new Date("0000-01-01"),
                  lte: S_Ed_Calc_Date ? new Date(S_Ed_Calc_Date) : new Date("9999-12-31"),
                },
              },
            ],
          },
      



          

          {
            TM_WorkG: {
              Pl_Object: {
                contains: Plan_Target,
              },
            },
          },
        ],
      },
      include: {
        TM_Item1: {
          select: {
            Item1_Name: true,
            Item1_Grp: true,
          },
        },
        TM_WorkG: {
          select: {
            WorkG_Symbol: true,
            Pl_Object: true,
          },
        },
        TM_Customer: {
          select: {
            Customer_Abb: true,
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



