const SHEET_NAME = "Leads";

function doPost(e) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
    }

    // Create headers automatically if the sheet is empty.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Name",
        "Email",
        "Business / Project",
        "Message"
      ]);
      sheet.setFrozenRows(1);
    }

    const data = e && e.parameter ? e.parameter : {};

    sheet.appendRow([
      new Date(),
      sanitizeCell(data.name),
      sanitizeCell(data.email),
      sanitizeCell(data.business),
      sanitizeCell(data.message)
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(error) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Prevent values beginning with =, +, -, or @ from being interpreted
// as spreadsheet formulas when submitted by a visitor.
function sanitizeCell(value) {
  const text = String(value || "").trim();
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}
