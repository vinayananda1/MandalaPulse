// 🧘 MandalaPulse Invocation Scroll
// Unified backend for user, meeting, and email management

// 🔐 Validate login credentials
function validate(email, password) {
  const sheet = SpreadsheetApp.openById("1xtDZsPH-cAHeudQNXkmYkJtXxlwxpWacEdgPF2uYiiE").getSheetByName("Users");
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === email && data[i][2] === password) {
      return { status: "✅", role: data[i][3], name: data[i][0] };
    }
  }
  return { status: "🛑 Invalid credentials" };
}

// 👥 Get all users
function getAllUsers() {
  const sheet = SpreadsheetApp.openById("1xtDZsPH-cAHeudQNXkmYkJtXxlwxpWacEdgPF2uYiiE").getSheetByName("Users");
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const users = [];

  for (let i = 1; i < data.length; i++) {
    const row = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = data[i][j];
    }
    row.rowIndex = i + 1;
    users.push(row);
  }
  return users;
}

// ➕ Add new user
function addNewUser(userData) {
  const sheet = SpreadsheetApp.openById("1xtDZsPH-cAHeudQNXkmYkJtXxlwxpWacEdgPF2uYiiE").getSheetByName("Users");
  sheet.appendRow([
    userData.Name || "",
    userData.Email || "",
    userData.Role || "",
    userData.Status || ""
  ]);
  return "✅ User added successfully";
}

// 🗑️ Delete user by row index
function deleteUser(rowIndex) {
  const sheet = SpreadsheetApp.openById("1xtDZsPH-cAHeudQNXkmYkJtXxlwxpWacEdgPF2uYiiE").getSheetByName("Users");
  sheet.deleteRow(rowIndex);
  return "🗑️ User deleted";
}

// 🗓️ Get all meetings
function getAllMeetings() {
  const sheet = SpreadsheetApp.openById("1xtDZsPH-cAHeudQNXkmYkJtXxlwxpWacEdgPF2uYiiE").getSheetByName("Meetings");
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const meetings = [];

  for (let i = 1; i < data.length; i++) {
    const row = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = data[i][j];
    }
    row.rowIndex = i + 1;
    meetings.push(row);
  }
  return meetings;
}

// ➕ Add new meeting and send emails
function addMeeting(meetingData) {
  const sheet = SpreadsheetApp.openById("1xtDZsPH-cAHeudQNXkmYkJtXxlwxpWacEdgPF2uYiiE").getSheetByName("Meetings");
  sheet.appendRow([
    meetingData.Date,
    meetingData.Time,
    meetingData.Topic,
    meetingData.Host
  ]);

  sendMeetingEmail(meetingData);
  sendMeetingToSoftware(meetingData);

  try {
    const logSheet = SpreadsheetApp.openById("1xtDZsPH-cAHeudQNXkmYkJtXxlwxpWacEdgPF2uYiiE").getSheetByName("Log");
    logSheet.appendRow([
      new Date(),
      "Meeting Email Sent",
      meetingData.Topic,
      meetingData.Date,
      meetingData.Time,
      meetingData.Host
    ]);
  } catch (err) {}

  return "✅ Meeting added and emails dispatched";
}

// 📧 Send meeting email to admin
function sendMeetingEmail(meetingData) {
  const recipients = "admin@mandalapulse.org";
  const subject = `🔮 New Meeting Scheduled: ${meetingData.Topic}`;
  const adminBody = `
Dear Seeker,

A new meeting has been scheduled:

📅 Date: ${meetingData.Date}
🕰️ Time: ${meetingData.Time}
🧭 Topic: ${meetingData.Topic}
🧘 Host: ${meetingData.Host}

Please prepare accordingly.

MandalaPulse Invocation System
`;

  MailApp.sendEmail(recipients, subject, adminBody);
}

// 📧 Send structured meeting email to software
function sendMeetingToSoftware(meetingData) {
  const recipients = "vincloudlink@gmail.com";
  const subject = `🔮 Meeting Invocation: ${meetingData.Topic}`;
  const softwareBody = `
MeetingInvocation:
Date: ${meetingData.Date}
Time: ${meetingData.Time}
Topic: ${meetingData.Topic}
Host: ${meetingData.Host}
Code: ${Date.now()}
Source: MandalaPulse

<table border="1" cellpadding="6" style="border-collapse: collapse; margin-top: 10px;">
  <tr><th>Date</th><th>Time</th><th>Topic</th><th>Host</th><th>Code</th><th>Source</th></tr>
  <tr>
    <td>${meetingData.Date}</td>
    <td>${meetingData.Time}</td>
    <td>${meetingData.Topic}</td>
    <td>${meetingData.Host}</td>
    <td>${Date.now()}</td>
    <td>MandalaPulse</td>
  </tr>
</table>
`;

  MailApp.sendEmail({
    to: recipients,
    subject: subject,
    htmlBody: softwareBody
  });
}

// 🧾 Log invocation manually
function logInvocation(action, detail) {
  const sheet = SpreadsheetApp.openById("1xtDZsPH-cAHeudQNXkmYkJtXxlwxpWacEdgPF2uYiiE").getSheetByName("Log");
  sheet.appendRow([new Date(), action, detail]);
}

// 🌐 Web App receiver for GitHub frontend
function doPost(e) {
  try {
    const meetingData = JSON.parse(e.postData.contents);
    return ContentService.createTextOutput(addMeeting(meetingData));
  } catch (err) {
    return ContentService.createTextOutput("🛑 Invocation failed: " + err.message);
  }
}
