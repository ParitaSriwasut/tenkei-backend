const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const createError = require("../utils/create-error");
const prisma = require("../models/prisma");

// Helper function to validate and parse dates
function parseDate(date) {
  const parsedDate = new Date(date);
  return isNaN(parsedDate) ? null : parsedDate; // Return null if the date is invalid
}

// Main function to import purchase CSV
exports.import_purchase_csv = async (req, res, next) => {
  try {
    // Step 1: Delete all records in the table before processing CSV files
    const deletedRecords = await this.delete_TT_NAV_Pc_CSV_Upd(req, res, next);

    // Step 2: Process the CSV files and count the records
    const folderPath = "C:/"; // Set the fixed folder path
    const backupFolderPath = "C:/TENKEI/Purchase_CSV/BK"; // Set the backup folder path
    if (!fs.existsSync(backupFolderPath)) {
        fs.mkdirSync(backupFolderPath, { recursive: true }); // Create folder if it doesn't exist
        console.log(`Backup folder created at: ${backupFolderPath}`);
      } else {
        console.log(`Backup folder already exists at: ${backupFolderPath}`);
      }
    const files = fs.readdirSync(folderPath); // Read files from the folder
    const csvFiles = files.filter((file) => file.endsWith(".csv")); // Filter CSV files

    if (csvFiles.length === 0) {
      throw createError(400, "No CSV files found in the specified folder.");
    }

    let totalRecords = 0;

    // Step 3: Loop through each CSV file and count the records
    let fileIndex = 1; // Counter to print the loop as 1.. 2.. 3..
    for (const file of csvFiles) {
      const filePath = path.join(folderPath, file);
      const backupFilePath = path.join(backupFolderPath, file); // Backup file path
      let recordCount = 0;

      console.log(`Processing file ${fileIndex}...`); // Print the current file index (1.. 2.. 3..)

      // Parse the CSV file
      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on("data", async (row) => {
            recordCount++;

            // Map the CSV row to your table's schema
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
              OdPc_No: `${row["Sales Order No_"]}${row["No_"]}`, // Concatenate Order_No and Procure_No
              OdPcLn_No: `${row["Sales Order No_"]}${row["No_"]}${parseInt(row["Line No_"])}`, // Concatenate Order_No, Procure_No, and Pc_Line_No
            };

            // Step 4: Save record to the tT_NAV_Pc_CSV table
            try {
              await prisma.tT_NAV_Pc_CSV.create({
                data: record,
              });
            } catch (insertErr) {
              console.error(
                `Error inserting record into tT_NAV_Pc_CSV for Order No: ${record.Procure_No}: ${insertErr.message}`
              );
              return; // Skip further processing if saving fails
            }

            // Step 5: Check for duplicates in the tT_NAV_Pc_CSV_Upd table
            const existingRecord = await prisma.tT_NAV_Pc_CSV_Upd.findFirst({
              where: {
                Procure_No: record.Procure_No,
                Vendor_CD: record.Vendor_CD,
              },
            });

            if (!existingRecord) {
              // No duplicate found, insert into the tT_NAV_Pc_CSV_Upd table
              try {
                await prisma.tT_NAV_Pc_CSV_Upd.create({
                  data: record,
                });
              } catch (insertErr) {
                console.error(
                  `Error inserting record into tT_NAV_Pc_CSV_Upd for Order No: ${record.Procure_No}: ${insertErr.message}`
                );
              }
            } else {
              // Duplicate found, replace it with the new record
              try {
                await prisma.tT_NAV_Pc_CSV_Upd.updateMany({
                  where: {
                    Procure_No: record.Procure_No,
                    Vendor_CD: record.Vendor_CD,
                  },
                  data: record, // Replace the old record with the new record
                });
              } catch (updateErr) {
                console.error(
                  `Error updating duplicate record for Order No: ${record.Procure_No}: ${updateErr.message}`
                );
              }
            }
          })
          .on("end", async () => {
            totalRecords += recordCount;
            console.log(`File ${fileIndex} processed, found ${recordCount} records.`);

            // Copy the CSV file to the backup folder
            try {
              fs.copyFileSync(filePath, backupFilePath);
              console.log(
                `File ${fileIndex} backed up successfully to ${backupFilePath}`
              );
            } catch (copyErr) {
              console.error(`Error copying file ${file}: ${copyErr.message}`);
            }

            // Clear data in tT_NAV_Pc_CSV table
            try {
              await prisma.tT_NAV_Pc_CSV.deleteMany({});
              console.log(
                `Data in tT_NAV_Pc_CSV table cleared after processing file ${fileIndex}.`
              );
            } catch (clearErr) {
              console.error(
                `Error clearing tT_NAV_Pc_CSV table: ${clearErr.message}`
              );
            }

            fileIndex++; // Increment the file counter
            resolve();
          })
          .on("error", (err) => {
            reject(createError(500, `Error reading file ${file}: ${err.message}`));
          });
      });
    }

  // Step 6: Fetch the tT_NAV_Pc_CSV_Upd table data
  const updatedRecords = await prisma.tT_NAV_Pc_CSV_Upd.findMany();
  const procureRecords = await prisma.tD_Procure.findMany();

  // Step 1: Loop through each updated record from TT_NAV_Pc_CSV_Upd
  for (const updatedRecord of updatedRecords) {
    // Step 2: Find matching record from TD_Procure based on Procure_No and Vendor_CD
    const matchingProcure = procureRecords.find(
      (procure) =>
        procure.Procure_No === updatedRecord.Procure_No &&
        procure.Vendor_CD === updatedRecord.Vendor_CD
    );
  
    // Step 3: If matching record is found, perform the desired action
    if (matchingProcure) {
      // For example, you can log the matching records or perform an update
      console.log('Matching record found:', {
        updatedRecord,
        matchingProcure,
      });
  
      // Optional: Update the TD_Procure table with the data from TT_NAV_Pc_CSV_Upd if needed
      try {
        await prisma.tD_Procure.update({
          where: {
            OdPcLn_No: matchingProcure.OdPcLn_No, // Assuming OdPcLn_No is the unique identifier for TD_Procure
          },
          data: {
            // Update the fields as required
            Pc_Name: updatedRecord.Pc_Name,
            Unit_Price: updatedRecord.Unit_Price,
            Pc_Qty: updatedRecord.Pc_Qty,
            // Add other fields you want to update
          },
        });
        console.log('Record updated in TD_Procure');
      } catch (updateErr) {
        console.error('Error updating TD_Procure:', updateErr.message);
      }
    }
  }


  // Step 7: Send response with total records and updated table data
  res.status(200).json({
    message: `Successfully processed ${totalRecords} records.`,
    data: updatedRecords, // Include updated table data
  });
} catch (error) {
  next(error); // Pass errors to the error-handling middleware
}
};





exports.delete_TT_NAV_Pc_CSV_Upd = async (req, res, next) => {
  try {
    // Step 1: Delete all records in the table
    const deletedRecords = await prisma.tT_NAV_Pc_CSV_Upd.deleteMany();

    return {
      count: deletedRecords.count, // Return the count of deleted records
    };
  } catch (err) {
    // Log the error for debugging
    console.error("Error deleting TT_NAV_Pc_CSV_Upd:", err);
    return next(createError(500, "Internal Server Error"));
  }
};
