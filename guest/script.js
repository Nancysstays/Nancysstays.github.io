function processLogin(username, password) {
  // 1. Get the Google Sheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("UserData"); // Replace "UserData" with your sheet name

  // 2. Get the user data from the sheet
  var data = sheet.getDataRange().getValues();

  // 3. Find the user
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] === username && data[i][1] === password) {
      // User found!
      return "Login successful!"; 
    }
  }

  // 4. If user not found, add them to the sheet
  sheet.appendRow([username, password]); 
  return "User added and logged in!";
}
