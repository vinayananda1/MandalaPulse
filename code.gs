// 🌼 Serve seeker data to login.html
function doGet(e) {
  const email = e?.parameter?.email;
  const name = e?.parameter?.name;

  // 📜 If guest email is submitted, log it
  if (email && name) {
    logGuestEmail(email, name);
    return ContentService.createTextOutput("Guest email logged").setMimeType(ContentService.MimeType.TEXT);
  }

  // 🌼 Serve seeker data from Users sheet
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Users');
  const data = [];
  const rows = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    data.push({
      username: row[0],
      password: row[1],
      role: row[2],
      fullName: row[3],
      invocationCode: row[4],
      approvedBy: row[5],
      email: row[6] || ""
    });
  }

  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

// 🧘 Log guest email to GuestEmails sheet
function logGuestEmail(email, name) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('GuestEmails');
  if (!sheet) return;

  const timestamp = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd-MM-yyyy HH:mm:ss");
  sheet.appendRow([name, email, timestamp]);
}

// 🌸 Log successful invocation to Log sheet
function logInvocation(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Log');
  if (!sheet) return;

  const timestamp = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd-MM-yyyy HH:mm:ss");
  sheet.appendRow([
    data.fullName,
    data.role,
    data.invocationCode,
    data.approvedBy,
    timestamp,
    data.device || "Unknown"
  ]);
}
