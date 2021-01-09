// Variables
var userName = document.getElementById('username');
var userPw = document.getElementById('password');
var loginBtn = document.getElementById('login');
var loginForm = document.getElementById("login-form");
var localName;
var localPassword;
var loggedIn = false;

// Check username and store in localStorage if correct
function checkName() {
  if (userName.value.length == 0) {
    alert("Please enter a username!");
    return false;
  } else if (userName.value.length > 0) {
    localStorage.setItem('name', userName.value);
    localName = localStorage.getItem('name');
    return true;
  }
}

// Check password and store in localStorage if correct
function checkPass() {
  if (userPw.value.length == 0) {
    alert("Please enter a password!");
    return false;
  } else if (userPw.value.length < 8) {
    alert("Please enter a password with 8 characters or more!");
    return false;
  } else if (userPw.value == 'password') {
    localStorage.setItem('password', userPw.value);
    localPassword = localStorage.getItem('password');
    return true;
  }
}

// Validate inputs, add loader and hide login form elements 
$(document).ready(function () {
  $('#login').click(function () {
    if(checkName() && checkPass()){
      $(this).prop("disabled", true);
      $(this).html(`<span class="spinner-border spinner-border-lg" role="status" aria-hidden="true"></span>`);

      loggedIn = true;
  
      setTimeout(function () {
        if (localName.length > 0 && localPassword == 'password') {
          $(loginForm).hide();
        }
      },2000);
    }
  });
});

// Change border of form name input when clicked
$(document).ready(function () {
  $(function () {
    $('.input-with-icon-name').on('click', function () {
      $('.icon-wrap-name').toggleClass('iconWrapBorderColor');
    });
  });
});

// Change border of form pass input when clicked
$(document).ready(function () {
  $(function () {
    $('.input-with-icon-pass').on('click', function () {
      $('.icon-wrap-pass').toggleClass('iconWrapBorderColor');
    });
  });
});