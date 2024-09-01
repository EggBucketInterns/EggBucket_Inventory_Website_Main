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

    // Parallelize data fetching
    let [outlets, closingStockData] = await Promise.all([getAllOutlet(), getOutletData()]);

    outlets.sort();

    // Headers remain as they are
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
      headerValues.push(row);  // Adding the data rows
    });

    // Reverse only the data rows (excluding the first two header rows)
    const dataRows = headerValues.slice(2).reverse();  // Slice and reverse only data rows
    const finalValues = [...headerValues.slice(0, 2), ...dataRows];  // Combine headers with reversed data rows

    // Updating the sheet in one bulk operation
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
      error: err.message,   // Include error details in the response
      stack: err.stack      // Optionally include the stack trace
  });
  }
};



module.exports = { SetupSheet }