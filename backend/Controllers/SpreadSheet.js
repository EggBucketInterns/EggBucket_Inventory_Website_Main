const { google } = require("googleapis");
const { getAllOutlet, getOutletData } = require("./Queries.js");
const path = require("path")

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

const SetupSheet = async (req, res) => {
  try {
    const { sheets } = await authSheets();
    const spreadsheetId = "1_FQT28T2pwdSu2tFXZE9oXOP7juDNDhK8ILtgz5alhc";


    let [outlets, closingStockData] = await Promise.all([getAllOutlet(), getOutletData()]);

    outlets.sort();


    const headerValues = [["Date"]];
    const subHeaders = [""];

    outlets.forEach((outlet) => {
      headerValues[0].push(outlet);
      subHeaders.push("Closing Stock");
    });

    headerValues.push(subHeaders);

    // Constructing data rows
    closingStockData.forEach((entry) => {
      const row = [entry.date];
      const tempMap = new Map(entry.data.map((item) => [item.name, item.eveningStock]));
      outlets.forEach((outlet) => row.push(tempMap.get(outlet) || ""));
      headerValues.push(row);
    });


    const dataRows = headerValues.slice(2).reverse();
    const finalValues = [...headerValues.slice(0, 2), ...dataRows];


    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: "Sheet1!A1",
      valueInputOption: "USER_ENTERED",
      resource: { values: finalValues },
    });

    res.status(200).send("Spreadsheet updated successfully");
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
      stack: err.stack
    });
  }
};



module.exports = { SetupSheet }