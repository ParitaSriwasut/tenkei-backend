

const fs = require("fs");
const path = require("path");
const csvParser = require("csv-parser");
const createError = require("../utils/create-error");
const prisma = require("../models/prisma");

const parseDate = (dateString) => {
  // Assuming date format is YYYY-MM-DD or similar. Adjust parsing as necessary.
  return dateString ? new Date(dateString) : null;
};

const Csv_Import = async (req, res, next) => {
  try {
    const sourceDir = "C:/TENKEI/Purchase_CSV";
    const backupDir = "C:/TENKEI/Purchase_CSV/BK";
    const files = fs.readdirSync(sourceDir);

    const duplicateRecords = [];
    const importedRecords = [];
    const updatedRecords = []; // To store before and after records for updates

    for (const file of files) {
      const filePath = path.join(sourceDir, file);

      // Process CSV file
      const records = [];
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on("data", (row) => {
          // Map the CSV data to the structure for the database
          const record = {
            Procure_No: row["No_"],
            Vendor_CD: row["Buy-from Vendor No_"],
            Pc_Date: parseDate(row["Order Date"]),
            Pc_Line_No: parseInt(row["Line No_"]),
            Order_No: row["Sales Order No_"],
            Pc_Name: row["Description"],
            Pc_Material: row["Description 2"],
            Unit_Price: parseFloat(row["Direct Unit Cost"]),
            Pc_Qty: parseFloat(row["Quantity"]),
            Pc_Unit_CD: row["Unit of Measure Code"],
            Pc_Person_CD: row["Purchaser Code"],
            Pc_Req_Delivery: parseDate(row["Expected Receipt Date"]),
            Pc_Ans_Delivery: parseDate(row["Vendor Confirm Delivery Date"]),
            Pc_Arrival_Date: parseDate(row["Date Received"]),
            Pc_Arrival_Qty: parseFloat(row["Quantity Received"]),
            Pc_NAV_Reg_Date: parseDate(row["Insert Date"]),
            Pc_NAV_Upd_Date: parseDate(row["Modify Date"]),
            Pc_Progress_CD: row["Flag"],
            OdPc_No: `${row["Sales Order No_"]}${row["No_"]}`,
            OdPcLn_No: `${row["Sales Order No_"]}${row["No_"]}${parseInt(row["Line No_"])}`,
          };
          records.push(record);
        })
        .on("end", async () => {
          // Process records after CSV is completely read
          for (const record of records) {
            const existingRecord = await prisma.tD_Procure.findUnique({
              where: { OdPcLn_No: record.OdPcLn_No },
            });

            if (existingRecord) {
              // If duplicate is found, store the existing record (before)
              const beforeRecord = existingRecord;

              // Update the existing record with the new data
              const updatedRecord = await prisma.tD_Procure.update({
                where: { OdPcLn_No: record.OdPcLn_No },
                data: record,
              });

              // Store both the before and after (updated) records
              updatedRecords.push({ before: beforeRecord, after: updatedRecord });
              duplicateRecords.push(record); // Add to duplicates list
            } else {
              // Save the new record if not a duplicate
              const newRecord = await prisma.tD_rocure.create({
                data: record,
              });
              importedRecords.push(newRecord); // Add to imported records list
            }
          }

          // Move the processed file to the backup directory
          const backupPath = path.join(backupDir, file);
          fs.renameSync(filePath, backupPath);

          // Send response back to the front-end with before and after records
          res.status(200).json({
            message: "CSV import completed.",
            importedRecords,
            duplicateRecords,
            updatedRecords, // Include the before and after updated records
          });
        });
    }
  } catch (err) {
    console.error("Error during CSV import:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

module.exports = { Csv_Import };
