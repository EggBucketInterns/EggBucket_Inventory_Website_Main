require('dotenv').config();
const { google } = require("googleapis");
const { getAllOutlet, getOutletData } = require("./Queries.js");
const path = require("path");
const credentials = require('../eggbucket-94837918740b.js');

async function authSheets() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials,
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

// Function to check and create sheet if not exists
async function ensureSheetExists(sheets, spreadsheetId, sheetTitle) {
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
  const sheetExists = spreadsheet.data.sheets.some(
    (s) => s.properties.title === sheetTitle
  );

  if (!sheetExists) {
    console.log(`Creating new sheet: ${sheetTitle}`);
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: sheetTitle,
              },
            },
          },
        ],
      },
    });
  } else {
    console.log(`Sheet already exists: ${sheetTitle}`);
  }
}

const SetupSheet = async (req, res) => {
  try {
    const { sheets } = await authSheets();
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    // Fetch outlet names from Firestore, ensure they are unique and trimmed
    let outlets = await getAllOutlet();
    outlets = [...new Set(outlets.map((outlet) => outlet.trim()))];
    outlets.sort();

    let stockData = await getOutletData();

    for (const outlet of outlets) {
      await ensureSheetExists(sheets, spreadsheetId, outlet);

      const values = [
        ["Date", "Morning Opening Stock", "Morning Closing Stock", "Evening Opening Stock", "Evening Closing Stock", "Purchased Stock"],
      ];

      stockData.forEach((entry) => {
        const outletData = entry.data.find((item) => item.name === outlet) || {};
        values.push([
          entry.date,
          outletData.morning_opening_stock?.toString() || "",
          outletData.morning_closing_stock?.toString() || "",
          outletData.evening_opening_stock?.toString() || "",
          outletData.evening_closing_stock?.toString() || "",
          outletData.purchasedStock?.toString() || "",
        ]);
      });

      const headers = values.slice(0, 1);
      const dataRows = values.slice(1).sort((a, b) => new Date(b[0]) - new Date(a[0]));
      const sortedValues = [...headers, ...dataRows];

      console.log(`Updating sheet: ${outlet} with data`);
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${outlet}!A1:F${sortedValues.length}`,
        valueInputOption: "USER_ENTERED",
        resource: {
          values: sortedValues,
        },
      });
    }

    res.status(200).json({ message: "Spreadsheet updated successfully with separate sheets for each outlet" });
  } catch (err) {
    console.error("Error updating spreadsheet:", err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
      stack: err.stack,
    });
  }
};

module.exports = { SetupSheet };