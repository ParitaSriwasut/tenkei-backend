const fs = require("fs");
const path = require("path");
const csvParser = require("csv-parser");
const createError = require("../utils/create-error");
const prisma = require("../models/prisma");

exports.fetchtt_order_csv_upd = async (req, res, next) => {
  try {
    const NAVOCUPD = await prisma.tT_NAV_Od_CSV_Upd.findMany();

    return res.status(200).json({
      status: "success",
      data: {
        NAVOCUPD: NAVOCUPD,
      },
    });
  } catch (err) {
    console.error("Error searching NAVOCUPD:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.fetchtt_order_csv = async (req, res, next) => {
  try {
    const NAVOC = await prisma.tT_NAV_Od_CSV.findMany();

    return res.status(200).json({
      status: "success",
      data: {
        NAVOC: NAVOC,
      },
    });
  } catch (err) {
    console.error("Error searching NAVOC:", err);
    return next(createError(500, "Internal Server Error"));
  }
};
exports.TT_NAV_Od_CSV = async (req, res, next) => {
  try {
    await prisma.tT_NAV_Od_CSV.deleteMany();

    const orderCsvDrive =
      "C:\\Users\\DELL\\Documents\\GitHub\\fock\\tenkei-backend-1\\src\\controllers\\Backup\\Order_CSV";
    const orderCsvMoveDrive =
      "C:\\Users\\DELL\\Documents\\GitHub\\fock\\tenkei-backend-1\\src\\controllers\\Backup\\Order_CSV\\BK";
    const orderCsvCopyDrive =
      "C:\\Users\\DELL\\Documents\\GitHub\\fock\\tenkei-backend-1\\src\\controllers\\Backup\\Order_CSV";
    const fileNamePattern = "Order_1.csv";

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

async function importCsvToDatabase(filePath) {
  const results = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .on("error", (err) => {
        console.error(`Error reading file ${filePath}:`, err.message);
        reject(err);
      })
      .pipe(csvParser())
      .on("data", (data) => {
      
     
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
          if (data.Request1_CD) {
            data.Request1_CD = parseInt(data.Request1_CD, 10);
          }
          
          if (data.Order_Date) {
            data.Order_Date = formatToDateTime(data.Order_Date);
            if (!data.Order_Date) {
              console.warn(`Invalid date format for Order_Date: ${data.Order_Date}`);
            }
          }
          
          if (data.Request_Delivery) {
            data.Request_Delivery = formatToDateTime(data.Request_Delivery);
            if (!data.Request_Delivery) {
              console.warn(`Invalid date format for Request_Delivery: ${data.Request_Delivery}`);
            }
          } else {
            console.warn(`Request_Delivery is missing or undefined in row`);
          }
          
          if (data.Od_Upd_Date) {
            data.Od_Upd_Date = formatToDateTime(data.Od_Upd_Date);
            if (!data.Od_Upd_Date) {
              console.warn(`Invalid date format for Od_Upd_Date: ${data.Od_Upd_Date}`);
            }
          }
        if (data.Quantity) {
          data.Quantity = parseFloat(data.Quantity);
        }
        if (data.Unit_Price) {
          data.Unit_Price = parseFloat(data.Unit_Price);
        }
        if (data.Amount) {
          data.Amount = parseFloat(data.Amount);
        }
        results.push(data);
      })
      .on("end", async () => {
        try {
          if (results.length > 0) {
            await prisma.tT_NAV_Od_CSV.createMany({
              data: results,
            });
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
exports.QT_NAV_Od_CSV_Upd_Add = async (req, res, next) => {
  try {
    const insertQuery = `
        INSERT INTO TT_NAV_Od_CSV_Upd ( Order_No, Request1_CD, Customer_CD, Sales_Person_CD, Order_Date, Request_Delivery, Od_Upd_Date, Item1_CD, NAV_Name, NAV_Size, Quantity, Unit_CD, Unit_Price, Amount, Customer_Draw, Company_Draw, Tolerance, Coating, Material1, Material2, H_Treatment1, H_Treatment2, Material3, Material4, Material5, H_Treatment3, H_Treatment4, H_Treatment5, Customer_Abb, Sl_Person_Name, PO_No )
        SELECT TT_NAV_Od_CSV.Order_No, TT_NAV_Od_CSV.Request1_CD, TT_NAV_Od_CSV.Customer_CD, TT_NAV_Od_CSV.Sales_Person_CD, TT_NAV_Od_CSV.Order_Date, TT_NAV_Od_CSV.Request_Delivery, TT_NAV_Od_CSV.Od_Upd_Date, TT_NAV_Od_CSV.Item1_CD, TT_NAV_Od_CSV.NAV_Name, TT_NAV_Od_CSV.NAV_Size, TT_NAV_Od_CSV.Quantity, TT_NAV_Od_CSV.Unit_CD, TT_NAV_Od_CSV.Unit_Price, TT_NAV_Od_CSV.Amount, TT_NAV_Od_CSV.Customer_Draw, TT_NAV_Od_CSV.Company_Draw, TT_NAV_Od_CSV.Tolerance, TT_NAV_Od_CSV.Coating, TT_NAV_Od_CSV.Material1, TT_NAV_Od_CSV.Material2, TT_NAV_Od_CSV.H_Treatment1, TT_NAV_Od_CSV.H_Treatment2, TT_NAV_Od_CSV.Material3, TT_NAV_Od_CSV.Material4, TT_NAV_Od_CSV.Material5, TT_NAV_Od_CSV.H_Treatment3, TT_NAV_Od_CSV.H_Treatment4, TT_NAV_Od_CSV.H_Treatment5, TT_NAV_Od_CSV.Customer_Abb, TT_NAV_Od_CSV.Sl_Person_Name, TT_NAV_Od_CSV.PO_No
        FROM TT_NAV_Od_CSV INNER JOIN TD_Order ON TT_NAV_Od_CSV.Order_No = TD_Order.Order_No;
        `;

    await prisma.$executeRawUnsafe(insertQuery);

    return res.status(201).json({
      status: "success",
      message: "Data inserted successfully into TT_NAV_Od_CSV_Upd!",
    });
  } catch (err) {
    console.error("Error creating NAVOCUPD:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.QT_NAV_Od_CSV_Upd_Upd = async (req, res, next) => {
  try {
    const updateQuery = `
            UPDATE TT_NAV_Od_CSV_Upd
            INNER JOIN TT_NAV_Od_CSV ON TT_NAV_Od_CSV.Order_No = TT_NAV_Od_CSV_Upd.Order_No
            SET 
                TT_NAV_Od_CSV_Upd.Order_No = TT_NAV_Od_CSV.Order_No,
                TT_NAV_Od_CSV_Upd.Request1_CD = TT_NAV_Od_CSV.Request1_CD,
                TT_NAV_Od_CSV_Upd.Customer_CD = TT_NAV_Od_CSV.Customer_CD,
                TT_NAV_Od_CSV_Upd.Sales_Person_CD = TT_NAV_Od_CSV.Sales_Person_CD,
                TT_NAV_Od_CSV_Upd.Order_Date = TT_NAV_Od_CSV.Order_Date,
                TT_NAV_Od_CSV_Upd.Request_Delivery = TT_NAV_Od_CSV.Request_Delivery,
                TT_NAV_Od_CSV_Upd.Od_Upd_Date = TT_NAV_Od_CSV.Od_Upd_Date,
                TT_NAV_Od_CSV_Upd.Item1_CD = TT_NAV_Od_CSV.Item1_CD,
                TT_NAV_Od_CSV_Upd.NAV_Name = TT_NAV_Od_CSV.NAV_Name,
                TT_NAV_Od_CSV_Upd.NAV_Size = TT_NAV_Od_CSV.NAV_Size,
                TT_NAV_Od_CSV_Upd.Quantity = TT_NAV_Od_CSV.Quantity,
                TT_NAV_Od_CSV_Upd.Unit_CD = TT_NAV_Od_CSV.Unit_CD,
                TT_NAV_Od_CSV_Upd.Unit_Price = TT_NAV_Od_CSV.Unit_Price,
                TT_NAV_Od_CSV_Upd.Amount = TT_NAV_Od_CSV.Amount,
                TT_NAV_Od_CSV_Upd.Customer_Draw = TT_NAV_Od_CSV.Customer_Draw,
                TT_NAV_Od_CSV_Upd.Company_Draw = TT_NAV_Od_CSV.Company_Draw,
                TT_NAV_Od_CSV_Upd.Tolerance = TT_NAV_Od_CSV.Tolerance,
                TT_NAV_Od_CSV_Upd.Coating = TT_NAV_Od_CSV.Coating,
                TT_NAV_Od_CSV_Upd.Material1 = TT_NAV_Od_CSV.Material1,
                TT_NAV_Od_CSV_Upd.Material2 = TT_NAV_Od_CSV.Material2,
                TT_NAV_Od_CSV_Upd.H_Treatment1 = TT_NAV_Od_CSV.H_Treatment1,
                TT_NAV_Od_CSV_Upd.H_Treatment2 = TT_NAV_Od_CSV.H_Treatment2,
                TT_NAV_Od_CSV_Upd.Material3 = TT_NAV_Od_CSV.Material3,
                TT_NAV_Od_CSV_Upd.Material4 = TT_NAV_Od_CSV.Material4,
                TT_NAV_Od_CSV_Upd.Material5 = TT_NAV_Od_CSV.Material5,
                TT_NAV_Od_CSV_Upd.H_Treatment3 = TT_NAV_Od_CSV.H_Treatment3,
                TT_NAV_Od_CSV_Upd.H_Treatment4 = TT_NAV_Od_CSV.H_Treatment4,
                TT_NAV_Od_CSV_Upd.H_Treatment5 = TT_NAV_Od_CSV.H_Treatment5,
                TT_NAV_Od_CSV_Upd.Customer_Abb = TT_NAV_Od_CSV.Customer_Abb,
                TT_NAV_Od_CSV_Upd.Sl_Person_Name = TT_NAV_Od_CSV.Sl_Person_Name,
                TT_NAV_Od_CSV_Upd.PO_No = TT_NAV_Od_CSV.PO_No;
        `;

    await prisma.$executeRawUnsafe(updateQuery);

    return res.status(200).json({
      status: "success",
      message: "Data updated successfully in TT_NAV_Od_CSV_Upd!",
    });
  } catch (err) {
    console.error("Error updating NAVOCUPD:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.QT_NAV_Od_CSV_Add = async (req, res, next) => {
  try {
    const insertQuery = `
           INSERT INTO TD_Order (
    Order_No, Product_Grp_CD, Customer_CD, NAV_Name, Product_Name, NAV_Size, Product_Size, Tolerance, 
    Customer_Draw, Company_Draw, Product_Draw, Quantity, Pd_Target_Qty, Unit_CD, Sales_Grp_CD, 
    Sales_Person_CD, Request1_CD, Material1, H_Treatment1, Material2, H_Treatment2, Material3, 
    H_Treatment3, Material4, H_Treatment4, Material5, H_Treatment5, Coating, Item1_CD, Od_No_of_Custom, 
    Unit_Price, Request_Delivery, Product_Delivery, Confirm_Delivery, Order_Date, Pd_Received_Date, 
    Od_Reg_Date, Od_Upd_Date, Od_NAV_Upd_Date
)
SELECT 
    TT_NAV_Od_CSV.Order_No, 
    CASE WHEN TT_NAV_Od_CSV.Request1_CD = 3 THEN 'FTC-P2' ELSE 'FTC-P1' END AS Grp, 
    TT_NAV_Od_CSV.Customer_CD, 
    TT_NAV_Od_CSV.NAV_Name, 
    TT_NAV_Od_CSV.NAV_Name, 
    TT_NAV_Od_CSV.NAV_Size, 
    TT_NAV_Od_CSV.NAV_Size, 
    TT_NAV_Od_CSV.Tolerance, 
    TT_NAV_Od_CSV.Customer_Draw, 
    TT_NAV_Od_CSV.Company_Draw, 
    CASE 
        WHEN TT_NAV_Od_CSV.Customer_Draw IS NULL THEN 
            CASE WHEN TT_NAV_Od_CSV.Company_Draw IS NULL THEN NULL 
            ELSE CONCAT('Com:', TT_NAV_Od_CSV.Company_Draw) END 
        WHEN TT_NAV_Od_CSV.Company_Draw IS NULL THEN CONCAT('Cus:', TT_NAV_Od_CSV.Customer_Draw) 
        ELSE CONCAT('Com:', TT_NAV_Od_CSV.Company_Draw, '/Cus:', TT_NAV_Od_CSV.Customer_Draw) 
    END AS Draw, 
    TT_NAV_Od_CSV.Quantity, 
    TT_NAV_Od_CSV.Quantity, 
    TT_NAV_Od_CSV.Unit_CD, 
    IFNULL((SELECT WorkG_CD FROM TM_Worker WHERE Worker_CD = TT_NAV_Od_CSV.Sales_Person_CD ), '') AS Sales_Grp, 
    TT_NAV_Od_CSV.Sales_Person_CD AS Sales_Person, 
    TT_NAV_Od_CSV.Request1_CD AS Req1, 
    TT_NAV_Od_CSV.Material1, 
    TT_NAV_Od_CSV.H_Treatment1, 
    TT_NAV_Od_CSV.Material2, 
    TT_NAV_Od_CSV.H_Treatment2, 
    TT_NAV_Od_CSV.Material3, 
    TT_NAV_Od_CSV.H_Treatment3, 
    TT_NAV_Od_CSV.Material4, 
    TT_NAV_Od_CSV.H_Treatment4, 
    TT_NAV_Od_CSV.Material5, 
    TT_NAV_Od_CSV.H_Treatment5, 
    TT_NAV_Od_CSV.Coating, 
    TT_NAV_Od_CSV.Item1_CD, 
    TT_NAV_Od_CSV.PO_No, 
    TT_NAV_Od_CSV.Unit_Price, 
    TT_NAV_Od_CSV.Request_Delivery, 
    TT_NAV_Od_CSV.Request_Delivery, 
    TT_NAV_Od_CSV.Request_Delivery, 
    TT_NAV_Od_CSV.Order_Date, 
    NOW() AS Received, 
    NOW() AS Reg, 
    NOW() AS Upd, 
    TT_NAV_Od_CSV.Od_Upd_Date
FROM TT_NAV_Od_CSV;
        `;

    // Execute the SQL query
    await prisma.$executeRawUnsafe(insertQuery);

    return res.status(200).json({
      status: "success",
      message: "Data inserted successfully into TD_Order!",
    });
  } catch (err) {
    console.error("Error inserting data into TD_Order:", err);
    return next(createError(500, "Internal Server Error"));
  }
};
