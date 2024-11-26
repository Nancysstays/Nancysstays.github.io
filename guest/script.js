// script.js
$(document).ready(function() {
  $("#loginForm").submit(function(event) {
    event.preventDefault();

    var username = $("#username").val();
    var password = $("#password").val();

    google.script.run
      .withSuccessHandler(handleLoginSuccess)
      .withFailureHandler(handleLoginFailure)
      .processLogin(username, password); 
  });

  function handleLoginSuccess(message) {
    $("#message").text(message).css("color", "green");
    fetchUserData(); // Fetch and display user data after successful login
  }

  function handleLoginFailure(error) {
    $("#message").text(error.message).css("color", "red");
  }

  function fetchUserData() {
    google.script.run.withSuccessHandler(displayUserData).getUserData();
  }

  function displayUserData(data) {
    var tableHtml = "<table><thead><tr><th>Username</th><th>Password</th></tr></thead><tbody>";
    for (var i = 0; i < data.length; i++) {
      tableHtml += "<tr><td>" + data[i][0] + "</td><td>" + data[i][1] + "</td></tr>";
    }
    tableHtml += "</tbody></table>";
    $("#userData").html(tableHtml);
  }

  // Fetch user data on page load
  fetchUserData();
});
