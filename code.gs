// 🌼 Serve seeker data to login.html
function doGet(e) {
  const view = e && e.parameter && e.parameter.view ? e.parameter.view : "login";
  const username = e && e.parameter && e.parameter.username ? e.parameter.username : "";
  const password = e && e.parameter && e.parameter.password ? e.parameter.password : "";

  switch (view) {
    case "login":
      return HtmlService.createHtmlOutputFromFile("login");

    case "welcome":
      const template = HtmlService.createTemplateFromFile("welcome");
      template.username = username;
      return template.evaluate();

    case "admin":
    case "user":
    case "guest":
    case "q":
      return HtmlService.createHtmlOutputFromFile(view);

    case "validate":
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Users");
      const data = sheet.getDataRange().getValues();

      for (let i = 1; i < data.length; i++) {
        if (data[i][0] === username && data[i][1] === password) {
          const role = data[i][2];
          const code = data[i][4];
          const approved = data[i][5];
          const name = data[i][0]; // or use FullName from Profiles if needed

          const url = role === "admin"
  ? `https://vinayananda1.github.io/MandalaPulse/admin.html?username=${username}&name=${name}&code=${code}&approved=${approved}`
  : ...
          return HtmlService.createHtmlOutput(`<script>window.location='${url}'</script>`);
        }
      }

      return HtmlService.createHtmlOutput("🛑 Invalid credentials. Please check your code.");

    default:
      return HtmlService.createHtmlOutput("🛑 Unknown view: " + view);
  }
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
