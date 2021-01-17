// Variables
var userName = document.getElementById('username');
var userPw = document.getElementById('password');
var loginBtn = document.getElementById('login');
var loginForm = document.getElementById("login-form");
var quizForm = document.getElementById("quiz");
var localName;
var localPassword;
var loggedIn = false;
var data;
var question;
var score;
var totalAnswers;


// Run API request on window load
function startQuiz() {
  sendApiRequest();
}

//Get questions from the API
async function sendApiRequest() {
  const url = 'https://opentdb.com/api.php?amount=10&type=multiple';
  const response = await fetch(url);
  console.log(response);
  data = await response.json();
  console.log(data);

  if (!response.ok) {
    document.getElementById('errors').innerHTML = `Sorry a ${response.status} error has occured. Try again later.`;
  } else {
    fillForm(data.results);
  }
}

//Fill form with question and answers
function fillForm(data) {
  console.log("Success!");
  $(loginForm).children().remove();
  $(quizForm).children().remove();
  for (index = 0; index < data.length; index++) {
    const element = data[index];
    const question = data[index].question;
    var answer = getAnswers(element);
    shuffle(answer);
    console.log(question);
    console.log(answer);
    console.log("question-" + (index + 1));
    $(quizForm).append("" +
      `<div class="question${index + 1}" style="display: none;">` +
      `<h2>The Quiz:</h2>` +
      `<div class="progress-bar">` +
      `</div>` +
      `<hr>` +
      `<p id="question">Question ${index + 1}:${question}</p>` +
      `<hr>` +
      `<div class="custom-control custom-radio text-left p-3 quiz-content">` +
      `<div class="form-check">` +
      `<input type="radio" id="answer-1" name="answer" class="custom-control-input">` +
      `<label for="answer-1" class="custom-control-label">${answer[0]}</label>` +
      `</div>` +
      `<div class="form-check">` +
      `<input type="radio" id="answer-2" name="answer" class="custom-control-input">` +
      `<label for="answer-2" class="custom-control-label">${answer[1]}</label>` +
      `</div>` +
      `<div class="form-check">` +
      `<input type="radio" id="answer-3" name="answer" class="custom-control-input">` +
      `<label for="answer-3" class="custom-control-label">${answer[2]}</label>` +
      `</div>` +
      `<div class="form-check">` +
      `<input type="radio" id="answer-4" name="answer" class="custom-control-input">` +
      `<label for="answer-4" class="custom-control-label">${answer[3]}</label>` +
      `</div>` +
      `</div>` +
      `<button type="button" class="btn btn-primary btn-block btn-lg" onclick="selectAnswer()">Next</button>` +
      `</div>`
    );
  }
  // document.querySelector('.question1').style.display = 'block';
  $('.question1').attr('style', 'display:block')
}

function increaseScore(data) {
  if (loggedIn) {
    totalAnswers = 0;
    totalAnswers++;
    for (index = 0; index < data.length; index++) {
      var selected = $('input[name=answer]:checked').next('label').html();
      var correct_answer = data[index].correct_answer;
      var incorrect_answers = data[index].incorrect_answers.includes(selected);
      score = 0;
      if (selected == correct_answer) {
        score++;
        console.log(score);
        $('input[name=answer]:checked').next('label').addClass('correct').append('<i class="fas fa-check p-2"></i>');
      } else if (incorrect_answers) {
        $('input[name=answer]:checked').next('label').addClass('incorrect').append('<i class="fas fa-times p-2"></i>');
        for (j = 1; j < 4; j++) {
          var unSelected = $(`input[id=answer-${j}]`).next('label').html();
          if (unSelected == correct_answer) {
            $(`input[id=answer-${j}]`).next('label').addClass('correct').append('<i class="fas fa-check p-2"></i>');
          }
        }
      }

    }
  }
}

function selectAnswer() {
  increaseScore(data.results);
}

// Fisher-Yates (aka Knuth) Shuffle algorithm - function borrowed in full from: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;
  console.log(currentIndex)

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


function getAnswers(answers) {
  // totalAnswers.push(answers.correct_answer);
  // totalAnswers.push(answers.incorrect_answers);
  var totalAnswers = answers.incorrect_answers.concat(answers.correct_answer);
  return totalAnswers;
}


// Check username and store in localStorage if correct
function checkName() {
  if (userName.value.length == 0) {
    document.getElementById('errors').innerHTML = "Please enter a username!";
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
    document.getElementById('errors').innerHTML = "Please enter a password!";
    return false;
  } else if (userPw.value.length < 8) {
    document.getElementById('errors').innerHTML = "Please enter a password with 8 characters or more!";
    return false;
  } else if (userPw.value == 'password' || userPw.value.length >= 8) {
    localStorage.setItem('password', userPw.value);
    localPassword = localStorage.getItem('password');
    return true;
  }
}

// Validate inputs, add loader and hide login form elements 
$(document).ready(function () {
  $('#login').click(function () {
    if (checkName() && checkPass() && localName.length > 0 && localPassword == 'password') {
      $(this).prop("disabled", true);
      $(this).html(`<span class="spinner-border spinner-border-lg" role="status" aria-hidden="true"></span>`);


      setTimeout(function () {
        loggedIn = true;
        $(loginForm).children().hide();
        $('.main-container').append(`<button type="button" class="btn btn-danger logout-btn" onclick="reloadPage()">Logout</button>`);
        $(loginForm).html("" +
          `<i class="fas fa-check-circle"></i>` +
          `<h1>Login Success!</h1>` +
          `<h2>Welcome ${localName}!</h2>` +
          `<hr>` +
          `<button type="button" class="btn btn-primary btn-block btn-lg" id="start" onclick="startQuiz()">Start Quiz</button>`);
      }, 2000);
    } else if (checkName() && checkPass() && localName.length > 0 && localPassword !== 'password') {
      $(this).prop("disabled", true);
      $(this).html(`<span class="spinner-border spinner-border-lg" role="status" aria-hidden="true"></span>`);
      loggedIn = false;

      setTimeout(function () {
        $(loginForm).children().hide();
        $(loginForm).html("" +
          `<i class="fas fa-exclamation-circle"></i>` +
          `<h1>Wrong Password!</h1>` +
          `<h2>Please try again!</h2>` +
          `<hr>` +
          `<button type="button" class="btn btn-primary btn-block btn-lg" id="retry" onclick="reloadPage()">Try Again</button>`);
      }, 2000);


    }

  });
});

function reloadPage() {
  window.location.reload();
  return false;
}

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
