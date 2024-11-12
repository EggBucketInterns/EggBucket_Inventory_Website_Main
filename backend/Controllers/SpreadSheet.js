const { google } = require("googleapis");
const { getAllOutlet, getOutletData } = require("./Queries.js");
const path = require("path");

async function authSheets() {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(__dirname, "..", "eggbucket-94837918740b.json"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const authClient = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: authClient });

    return { sheets };
  } catch (error) {
    console.error("Error during authentication:", error);
    throw new Error("Failed to authenticate with Google Sheets API");
  }
}

// New function to get the sheet ID for "Sheet1"
async function getSheetId(sheets, spreadsheetId, sheetName = "Sheet1") {
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
  const sheet = spreadsheet.data.sheets.find(s => s.properties.title === sheetName);
  
  if (!sheet) {
    throw new Error(`Sheet with name "${sheetName}" not found`);
  }

  console.log(`Sheet ID for "${sheetName}":`, sheet.properties.sheetId);
  return sheet.properties.sheetId;
}

const SetupSheet = async (req, res) => {
  try {
    const { sheets } = await authSheets();
    const spreadsheetId = "1eCyfbCmFoerH7VZK6QIf9W-vGtaS5QwMl5DTUlrQryY";

    // Get the sheet ID for "Sheet1"
    const sheetId = await getSheetId(sheets, spreadsheetId, "Sheet1");

    let [outlets, stockData] = await Promise.all([getAllOutlet(), getOutletData()]);
    outlets.sort();

    let values = [];
    
    // First header row - Outlet names
    const firstRow = ["Date"];
    outlets.forEach(outlet => {
      firstRow.push(outlet, outlet, outlet, outlet, outlet);
    });
    values.push(firstRow);

    // Second header row - Stock types
    const secondRow = [""];
    outlets.forEach(() => {
      secondRow.push("Morning Opening Stock", "Morning Closing Stock", "Evening Opening Stock", "Evening Closing Stock", "Purchased Stock");
    });
    values.push(secondRow);

    // Add data rows
    stockData.forEach(entry => {
      const row = [entry.date];
      outlets.forEach(outlet => {
        const outletData = entry.data.find(item => item.name === outlet) || {};
        row.push(
          outletData.morning_opening_stock?.toString() || "",
          outletData.morning_closing_stock?.toString() || "",
          outletData.evening_opening_stock?.toString() || "",
          outletData.evening_closing_stock?.toString() || "",
          outletData.purchasedStock?.toString() || ""
        );
      });
      values.push(row);
    });

    const headers = values.slice(0, 2);
    const dataRows = values.slice(2).sort((a, b) => new Date(b[0]) - new Date(a[0]));
    values = [...headers, ...dataRows];

    const lastColumn = String.fromCharCode(65 + (outlets.length * 5));

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Sheet1!A1:${lastColumn}${values.length}`,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: values
      }
    });

    // Format headers with the retrieved sheetId
    try {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            ...outlets.map((_, index) => ({
              mergeCells: {
                range: {
                  sheetId: sheetId,
                  startRowIndex: 0,
                  endRowIndex: 1,
                  startColumnIndex: 1 + (index * 5),
                  endColumnIndex: 6 + (index * 5)
                },
                mergeType: "MERGE_ALL"
              }
            })),
            {
              repeatCell: {
                range: {
                  sheetId: sheetId,
                  startRowIndex: 0,
                  endRowIndex: 2
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 0.8, green: 0.8, blue: 0.8 },
                    textFormat: { bold: true },
                    horizontalAlignment: "CENTER",
                    verticalAlignment: "MIDDLE"
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
              }
            }
          ]
        }
      });
    } catch (formatError) {
      console.error("Error applying formatting:", formatError);
    }

    res.status(200).json({ message: "Spreadsheet updated successfully" });
  } catch (err) {
    console.error("Error updating spreadsheet:", err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
      stack: err.stack
    });
  }
};

module.exports = { SetupSheet };
