const fs = require("fs");
const path = require("path");
const csvParser = require("csv-parser");
const createError = require("../utils/create-error");
const prisma = require("../models/prisma");


function mapFiledRow(row) {
  return {
    Procure_No: row["No_"],
    Vendor_CD: row["Buy-from Vendor No_"],
    Pc_Date: (row["Order Date"]),
    Pc_Line_No: parseInt(row["Line No_"]),
    Order_No: row["Sales Order No_"],
    Pc_Name: row["Description"],
    Pc_Material: row["Description 2"],
    Unit_Price: parseFloat(row["Direct Unit Cost"]),
    Pc_Qty: parseFloat(row["Quantity"]),
    Pc_Unit_CD: row["Unit of Measure Code"],
    Pc_Person_CD: row["Purchaser Code"],
    Pc_Req_Delivery: (row["Expected Receipt Date"]),
    Pc_Ans_Delivery: (row["Vendor Confirm Delivery Date"]),
    Pc_Arrival_Date:(row["Date Received"]),
    Pc_Arrival_Qty: parseFloat(row["Quantity Received"]),
    Pc_NAV_Reg_Date: (row["Insert Date"]),
    Pc_NAV_Upd_Date: (row["Modify Date"]),
    Pc_Progress_CD: row["Flag"],
    OdPc_No: `${row["Sales Order No_"]}${row["No_"]}`, // Concatenate Order_No and Procure_No
    OdPcLn_No: `${row["Sales Order No_"]}${row["No_"]}${parseInt(row["Line No_"])}`
    // Add more mappings as needed
  };
}


exports.fetchtt_purchase_csv_upd = async (req, res, next) => {
  try {
    const NAVPCUPD = await prisma.tT_NAV_Pc_CSV_Upd.findMany();

    return res.status(200).json({
      status: "success",
      data: {
        NAVPCUPD: NAVPCUPD,
      },
    });
  } catch (err) {
    console.error("Error searching NAVPCUPD:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.fetchtt_purchase_csv = async (req, res, next) => {
  try {
    const NAVPC = await prisma.tT_NAV_Pc_CSV.findMany();

    return res.status(200).json({
      status: "success",
      data: {
        NAVPC: NAVPC,
      },
    });
  } catch (err) {
    console.error("Error searching NAVPC:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.TT_NAV_PC_CSV = async (req, res, next) => {
  try {
    await prisma.tT_NAV_Pc_CSV.deleteMany();

    const orderCsvDrive =
      "C:\\TENKEI\\Purchase_CSV";
    const orderCsvMoveDrive =
      "C:\\TENKEI\\Purchase_CSV\\BK";
    const orderCsvCopyDrive =
      "C:\\TENKEI\\Purchase_CSV";
    const fileNamePattern = "Procure_20220112145720.csv";

    const files = fs.readdirSync(orderCsvDrive);

    for (const file of files) {
      if (file.includes(fileNamePattern)) {
        const filePath = path.join(orderCsvDrive, file);
        console.log(`Processing file: ${filePath}`);

        if (fs.existsSync(filePath)) {
          await importCsvToDatabase(filePath);

          if (orderCsvMoveDrive !== "") {
            fs.copyFileSync(filePath, path.join(orderCsvMoveDrive, file));
          }

          if (orderCsvCopyDrive !== "") {
            fs.copyFileSync(filePath, path.join(orderCsvCopyDrive, file));
          }

          fs.unlinkSync(filePath);
        } else {
          console.error(`File not found: ${filePath}`);
        }
      }
    }

    res.status(200).send("CSV processed successfully");
  } catch (err) {
    console.error("Error inserting data into TT_NAV_Od_CSV", err);
    return next(createError(500, "Internal Server Error"));
  }
};
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function importCsvToDatabase(filePath) {
  
  const results =[];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .on("error", (err) => {
        console.error(`Error reading file ${filePath}:`, err.message);
        reject(err);
      })
      .pipe(csvParser())
      .on("data", (data) => {
        const mappedData = mapFiledRow(data);
     
        function formatToDateTime(date) {
          if (!date) {
            return null; 
          }
        
       
          const [day, month, year] = date.split("/"); 
        
       
          const formattedDate = new Date(`${year}-${month}-${day}`);
        
        
          if (!isNaN(formattedDate.getTime())) {
            const year = formattedDate.getFullYear();
            const month = String(formattedDate.getMonth() + 1).padStart(2, "0");
            const day = String(formattedDate.getDate()).padStart(2, "0");
            const hours = String(formattedDate.getHours()).padStart(2, "0");
            const minutes = String(formattedDate.getMinutes()).padStart(2, "0");
            const seconds = String(formattedDate.getSeconds()).padStart(2, "0");
        
            return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;
          } else {
            console.warn(`Invalid date format: ${date}`);
            return null;
          }
        }
        if (mappedData.Pc_Date) {
          mappedData.Pc_Date = formatToDateTime(mappedData.Pc_Date);
          if (!mappedData.Pc_Date) {
            console.warn(`Invalid date format for Order_Date: ${mappedData.Pc_Date}`);
          }
        }
        if (mappedData.Pc_Req_Delivery) {
          mappedData.Pc_Req_Delivery = formatToDateTime(mappedData.Pc_Req_Delivery);
          if (!mappedData.Pc_Req_Delivery) {
            console.warn(`Invalid date format for Order_Date: ${mappedData.Pc_Req_Delivery}`);
          }
        }
        if (mappedData.Pc_Ans_Delivery) {
          mappedData.Pc_Ans_Delivery = formatToDateTime(mappedData.Pc_Ans_Delivery);
          if (!mappedData.Pc_Ans_Delivery) {
            console.warn(`Invalid date format for Order_Date: ${mappedData.Pc_Ans_Delivery}`);
          }
        }
        if (mappedData.Pc_Arrival_Date) {
          mappedData.Pc_Arrival_Date = formatToDateTime(mappedData.Pc_Arrival_Date);
          if (!mappedData.Pc_Arrival_Date) {
            console.warn(`Invalid date format for Order_Date: ${mappedData.Pc_Arrival_Date}`);
          }
        }
        if (mappedData.Pc_Arrival_Qty) {
          mappedData.Pc_Arrival_Qty = formatToDateTime(mappedData.Pc_Arrival_Qty);
          if (!mappedData.Pc_Arrival_Qty) {
            console.warn(`Invalid date format for Order_Date: ${mappedData.Pc_Arrival_Qty}`);
          }
        }
        if (mappedData.Pc_NAV_Reg_Date) {
          mappedData.Pc_NAV_Reg_Date = formatToDateTime(mappedData.Pc_NAV_Reg_Date);
          if (!mappedData.Pc_NAV_Reg_Date) {
            console.warn(`Invalid date format for Order_Date: ${mappedData.Pc_NAV_Reg_Date}`);
          }
        }
        if (mappedData.Pc_NAV_Upd_Date) {
          mappedData.Pc_NAV_Upd_Date = formatToDateTime(mappedData.Pc_NAV_Upd_Date);
          if (!mappedData.Pc_NAV_Upd_Date) {
            console.warn(`Invalid date format for Order_Date: ${mappedData.Pc_NAV_Upd_Date}`);
          }
        }
        
        



        results.push(mappedData);
      })
      .on("end", async () => {
        try {
          if (results.length > 0) {
            await prisma.tT_NAV_Pc_CSV.createMany({
              data: results,
            });
              // Adding delay before deleting the file
            await delay(1000); // Wait 1 second

            // Ensure file is not in use before attempting to delete
            if (fs.existsSync(filePath)) {
              await fs.promises.unlink(filePath);
            }

            resolve();
          } else {
            console.warn(`No data found in file ${filePath}`);
            resolve();
          }
        } catch (err) {
          console.error("Error importing CSV into database", err.message);
          reject(err);
        }
      });
  });
}

exports.QT_NAV_Pc_CSV_Upd_Add = async (req, res, next) => {
  try {
    const insertQuery = `
        INSERT INTO TT_NAV_Pc_CSV_Upd ( Procure_No, Vendor_CD, Pc_Date, Pc_Line_No, Order_No, Pc_Name, Pc_Material, Unit_Price, Pc_Qty, Pc_Unit_CD, Pc_Person_CD, Pc_Req_Delivery, Pc_Ans_Delivery, Pc_Arrival_Date, Pc_Arrival_Qty, Pc_NAV_Reg_Date, Pc_NAV_Upd_Date, Pc_Progress_CD, OdPc_No, OdPcLn_No )
SELECT TT_NAV_Pc_CSV.Procure_No, TT_NAV_Pc_CSV.Vendor_CD, TT_NAV_Pc_CSV.Pc_Date, TT_NAV_Pc_CSV.Pc_Line_No, TT_NAV_Pc_CSV.Order_No, TT_NAV_Pc_CSV.Pc_Name, TT_NAV_Pc_CSV.Pc_Material, TT_NAV_Pc_CSV.Unit_Price, TT_NAV_Pc_CSV.Pc_Qty, TT_NAV_Pc_CSV.Pc_Unit_CD, TT_NAV_Pc_CSV.Pc_Person_CD, TT_NAV_Pc_CSV.Pc_Req_Delivery, TT_NAV_Pc_CSV.Pc_Ans_Delivery, TT_NAV_Pc_CSV.Pc_Arrival_Date, TT_NAV_Pc_CSV.Pc_Arrival_Qty, TT_NAV_Pc_CSV.Pc_NAV_Reg_Date, TT_NAV_Pc_CSV.Pc_NAV_Upd_Date, TT_NAV_Pc_CSV.Pc_Progress_CD, TT_NAV_Pc_CSV.OdPc_No, TT_NAV_Pc_CSV.OdPcLn_No
FROM TT_NAV_Pc_CSV INNER JOIN TD_Procure ON TT_NAV_Pc_CSV.[OdPcLn_No] = TD_Procure.[OdPcLn_No];
        `;

    await prisma.$executeRawUnsafe(insertQuery);

    return res.status(201).json({
      status: "success",
      message: "Data inserted successfully into TT_NAV_Pc_CSV_Upd!",
    });
  } catch (err) {
    console.error("Error creating NAVPCUPD:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.QT_NAV_Pc_CSV_Upd_Upd = async (req, res, next) => {
  try {
    const updateQuery = `
            UPDATE TT_NAV_Pc_CSV INNER JOIN TT_NAV_Pc_CSV_Upd ON TT_NAV_Pc_CSV.[OdPcLn_No] = TT_NAV_Pc_CSV_Upd.[OdPcLn_No] SET TT_NAV_Pc_CSV_Upd.Procure_No = [TT_NAV_Pc_CSV]![Procure_No], 
            TT_NAV_Pc_CSV_Upd.Vendor_CD = [TT_NAV_Pc_CSV]![Vendor_CD], 
            TT_NAV_Pc_CSV_Upd.Pc_Date = [TT_NAV_Pc_CSV]![Pc_Date], 
            TT_NAV_Pc_CSV_Upd.Pc_Line_No = [TT_NAV_Pc_CSV]![Pc_Line_No], 
            TT_NAV_Pc_CSV_Upd.Order_No = [TT_NAV_Pc_CSV]![Order_No], 
            TT_NAV_Pc_CSV_Upd.Pc_Name = [TT_NAV_Pc_CSV]![Pc_Name], 
            TT_NAV_Pc_CSV_Upd.Pc_Material = [TT_NAV_Pc_CSV]![Pc_Material], 
            TT_NAV_Pc_CSV_Upd.Unit_Price = [TT_NAV_Pc_CSV]![Unit_Price], 
            TT_NAV_Pc_CSV_Upd.Pc_Qty = [TT_NAV_Pc_CSV]![Pc_Qty], 
            TT_NAV_Pc_CSV_Upd.Pc_Unit_CD = [TT_NAV_Pc_CSV]![Pc_Unit_CD], 
            TT_NAV_Pc_CSV_Upd.Pc_Person_CD = [TT_NAV_Pc_CSV]![Pc_Person_CD], 
            TT_NAV_Pc_CSV_Upd.Pc_Req_Delivery = [TT_NAV_Pc_CSV]![Pc_Req_Delivery], 
            TT_NAV_Pc_CSV_Upd.Pc_Ans_Delivery = [TT_NAV_Pc_CSV]![Pc_Ans_Delivery], 
            TT_NAV_Pc_CSV_Upd.Pc_Arrival_Date = [TT_NAV_Pc_CSV]![Pc_Arrival_Date], 
            TT_NAV_Pc_CSV_Upd.Pc_Arrival_Qty = [TT_NAV_Pc_CSV]![Pc_Arrival_Qty], 
            TT_NAV_Pc_CSV_Upd.Pc_NAV_Reg_Date = [TT_NAV_Pc_CSV]![Pc_NAV_Reg_Date], 
            TT_NAV_Pc_CSV_Upd.Pc_NAV_Upd_Date = [TT_NAV_Pc_CSV]![Pc_NAV_Upd_Date], 
            TT_NAV_Pc_CSV_Upd.Pc_Progress_CD = [TT_NAV_Pc_CSV]![Pc_Progress_CD], 
            TT_NAV_Pc_CSV_Upd.OdPc_No = [TT_NAV_Pc_CSV]![OdPc_No], 
            TT_NAV_Pc_CSV_Upd.OdPcLn_No = [TT_NAV_Pc_CSV]![OdPcLn_No];
        `;

    await prisma.$executeRawUnsafe(updateQuery);

    return res.status(200).json({
      status: "success",
      message: "Data updated successfully in TT_NAV_Pc_CSV_Upd!",
    });
  } catch (err) {
    console.error("Error updating NAVPCUPD:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.QT_NAV_Pc_CSV_Add = async (req, res, next) => {
  try {
    const insertQuery = `INSERT INTO TT_NAV_Pc_CSV_Upd ( Procure_No, Vendor_CD, Pc_Date, Pc_Line_No, Order_No, Pc_Name, Pc_Material, Unit_Price, Pc_Qty, Pc_Unit_CD, Pc_Person_CD, Pc_Req_Delivery, Pc_Ans_Delivery, Pc_Arrival_Date, Pc_Arrival_Qty, Pc_NAV_Reg_Date, Pc_NAV_Upd_Date, Pc_Progress_CD, OdPc_No, OdPcLn_No )
SELECT TT_NAV_Pc_CSV.Procure_No, TT_NAV_Pc_CSV.Vendor_CD, TT_NAV_Pc_CSV.Pc_Date, TT_NAV_Pc_CSV.Pc_Line_No, TT_NAV_Pc_CSV.Order_No, TT_NAV_Pc_CSV.Pc_Name, TT_NAV_Pc_CSV.Pc_Material, TT_NAV_Pc_CSV.Unit_Price, TT_NAV_Pc_CSV.Pc_Qty, TT_NAV_Pc_CSV.Pc_Unit_CD, TT_NAV_Pc_CSV.Pc_Person_CD, TT_NAV_Pc_CSV.Pc_Req_Delivery, TT_NAV_Pc_CSV.Pc_Ans_Delivery, TT_NAV_Pc_CSV.Pc_Arrival_Date, TT_NAV_Pc_CSV.Pc_Arrival_Qty, TT_NAV_Pc_CSV.Pc_NAV_Reg_Date, TT_NAV_Pc_CSV.Pc_NAV_Upd_Date, TT_NAV_Pc_CSV.Pc_Progress_CD, TT_NAV_Pc_CSV.OdPc_No, TT_NAV_Pc_CSV.OdPcLn_No
FROM TT_NAV_Pc_CSV INNER JOIN TD_Procure ON TT_NAV_Pc_CSV.[OdPcLn_No] = TD_Procure.[OdPcLn_No];

        `;

    // Execute the SQL query
    await prisma.$executeRawUnsafe(insertQuery);

    return res.status(200).json({
      status: "success",
      message: "Data inserted successfully into TD_Order!",
    });
  } catch (err) {
    console.error("Error inserting data into TD_Procure", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.QT_NAV_Pc_CSV_Upd_Ref = async (req, res, next) => {
  try {
    const insertQuery = `UPDATE TD_Procure 
    INNER JOIN TT_NAV_Pc_CSV_Upd ON 
    TD_Procure.[OdPcLn_No] = TT_NAV_Pc_CSV_Upd.[OdPcLn_No] 
    SET TD_Procure.Order_No = [TT_NAV_Pc_CSV_Upd]![Order_No],
     TD_Procure.Procure_No = [TT_NAV_Pc_CSV_Upd]![Procure_No],
      TD_Procure.OdPc_No = [TT_NAV_Pc_CSV_Upd]![OdPc_No],
      TD_Procure.OdPcLn_No = [TT_NAV_Pc_CSV_Upd]![OdPcLn_No],
      TD_Procure.Vendor_CD = [TT_NAV_Pc_CSV_Upd]![Vendor_CD],
      TD_Procure.Pc_Name = [TT_NAV_Pc_CSV_Upd]![Pc_Name],
      TD_Procure.Pc_Material = [TT_NAV_Pc_CSV_Upd]![Pc_Material],
      TD_Procure.Unit_Price = [TT_NAV_Pc_CSV_Upd]![Unit_Price],
      TD_Procure.Pc_Qty = [TT_NAV_Pc_CSV_Upd]![Pc_Qty],
      TD_Procure.Pc_Unit_CD = [TT_NAV_Pc_CSV_Upd]![Pc_Unit_CD], 
      TD_Procure.Pc_Person_CD = [TT_NAV_Pc_CSV_Upd]![Pc_Person_CD],
      TD_Procure.Pc_Date = [TT_NAV_Pc_CSV_Upd]![Pc_Date], 
      TD_Procure.Pc_Req_Delivery = [TT_NAV_Pc_CSV_Upd]![Pc_Req_Delivery], 
      TD_Procure.Pc_Ans_Delivery = [TT_NAV_Pc_CSV_Upd]![Pc_Ans_Delivery], 
      TD_Procure.Pc_Progress_CD = [TT_NAV_Pc_CSV_Upd]![Pc_Progress_CD], 
      TD_Procure.Pc_Arrival_Date = [TT_NAV_Pc_CSV_Upd]![Pc_Arrival_Date], 
      TD_Procure.Pc_Arrival_Qty = [TT_NAV_Pc_CSV_Upd]![Pc_Arrival_Qty], 
      TD_Procure.Pc_Upd_Date = Now(), TD_Procure.Pc_NAV_Reg_Date = [TT_NAV_Pc_CSV_Upd]![Pc_NAV_Reg_Date], 
      TD_Procure.Pc_NAV_Upd_Date = [TT_NAV_Pc_CSV_Upd]![Pc_NAV_Upd_Date], 
      TD_Procure.Pc_Line_No = [TT_NAV_Pc_CSV_Upd]![Pc_Line_No];

        `;

    // Execute the SQL query
    await prisma.$executeRawUnsafe(insertQuery);

    return res.status(200).json({
      status: "success",
      message: "Data inserted successfully into TD_Procure!",
    });
  } catch (err) {
    console.error("Error inserting data into TD_Procure", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.RD_NAV_Pc_Upd_Ref = async (req, res, next) => {
  try {
    const insertQuery = `SELECT TD_Order.*, TD_Procure.*, TT_NAV_Pc_CSV_Upd.* FROM TD_Order INNER JOIN (TD_Procure INNER JOIN TT_NAV_Pc_CSV_Upd ON [TD_Procure].[OdPcLn_No]=[TT_NAV_Pc_CSV_Upd].[OdPcLn_No]) ON [TD_Order].[Order_No]=[TD_Procure].[Order_No];  
    
        `;

    // Execute the SQL query
    const result = await prisma.$queryRaw(insertQuery)

    return res.status(200).json({
      status: "success",
      message: "Data inserted successfully into TD_Order!",
      data: result,
    });
  } catch (err) {
    console.error("Error inserting data into TD_Procure", err);
    return next(createError(500, "Internal Server Error"));
  }
};
