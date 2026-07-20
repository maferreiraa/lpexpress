const SPREADSHEET_ID = "1jPVjzp1stDpGQ4H_llsiMwxN_PfPjzgbtXgPbFGaqCI";
const SHEET_NAME = "Leads";

function doPost(e) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      sheet.appendRow([
        "Timestamp",
        "Name",
        "Email",
        "Business / Project",
        "Message"
      ]);
    }

    // Log incoming data for debugging
    console.log(JSON.stringify(e.parameter));

    const name = e.parameter.name || "";
    const email = e.parameter.email || "";
    const business = e.parameter.business || "";
    const message = e.parameter.message || "";

    sheet.appendRow([
      new Date(),
      name,
      email,
      business,
      message
    ]);

    SpreadsheetApp.flush();

    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        received: e.parameter
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error(error.stack || error.toString());
    throw error;
  }
}

// Open the /exec URL in a browser to confirm the deployment is live.
function doGet() {
  return ContentService
    .createTextOutput("Landing Page Express Leads integration is online.")
    .setMimeType(ContentService.MimeType.TEXT);
}

// Run this manually once inside Apps Script.
// If this row appears in the sheet, spreadsheet permissions are correct.
function testWrite() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow([
      "Timestamp",
      "Name",
      "Email",
      "Business / Project",
      "Message"
    ]);
  }

  sheet.appendRow([
    new Date(),
    "Manual Apps Script Test",
    "test@example.com",
    "MFX Test",
    "If you can see this row, Apps Script can write to this spreadsheet."
  ]);

  SpreadsheetApp.flush();
}
