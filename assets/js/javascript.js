// Variables
var userName = document.getElementById('username');
var userPw = document.getElementById('password');
var loginBtn = document.getElementById('login');
var loginForm = document.getElementById("login-form");
var quizForm = document.getElementById("quiz");
var progressBarComplete = document.getElementsByClassName('progress-bar-complete');
var progressBarSuccess = document.getElementsByClassName('success-progress-bar-complete');
var progressBarFail = document.getElementsByClassName('fail-progress-bar-complete');
var localName;
var localPassword;
var loggedIn = false;
var data;
var question;
var score = 0;
var totalAnswers = 0;
var answeredQuestions = 1;
var selected;
var correctIncrease;
var correctStr;
var incorrectStr;
const TOTAL_QUESTIONS = 10;





// Call sendApiRequest to start the Quiz
function startQuiz() {
  sendApiRequest();
}

// Get questions from the API
async function sendApiRequest() {
  var category = $('#category option:selected').val();
  var difficulty = $('#difficulty option:selected').text().toLowerCase();
  if (category == "Select...") {
    category = "";
  }
  if (difficulty == "select...") {
    difficulty = "";
  }
  var url = `https://opentdb.com/api.php?amount=10&type=multiple&category=${category}&difficulty=${difficulty}`;
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

// Fill form with question and answers
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
      `<div class="question question${index + 1}" style="display: none;">` +
      `<h2>The Quiz:</h2>` +
      `<div class="progress-bar">` +
      `<div class="progress-bar-complete">` +
      `</div>` +
      `</div>` +
      `<hr>` +
      `<p id="question">Question ${index + 1}:&nbsp;${question}</p>` +
      `<hr>` +
      `<div class="custom-control custom-radio text-left p-3 quiz-content">` +
      `<div class="form-check">` +
      `<input type="radio" id="answer-1-q-${index + 1}" name="answer" class="custom-control-input">` +
      `<label for="answer-1-q-${index + 1}" class="custom-control-label">${answer[0]}</label>` +
      `</div>` +
      `<div class="form-check">` +
      `<input type="radio" id="answer-2-q-${index + 1}" name="answer" class="custom-control-input">` +
      `<label for="answer-2-q-${index + 1}" class="custom-control-label">${answer[1]}</label>` +
      `</div>` +
      `<div class="form-check">` +
      `<input type="radio" id="answer-3-q-${index + 1}" name="answer" class="custom-control-input">` +
      `<label for="answer-3-q-${index + 1}" class="custom-control-label">${answer[2]}</label>` +
      `</div>` +
      `<div class="form-check">` +
      `<input type="radio" id="answer-4-q-${index + 1}" name="answer" class="custom-control-input">` +
      `<label for="answer-4-q-${index + 1}" class="custom-control-label">${answer[3]}</label>` +
      `</div>` +
      `</div>` +
      `<div class="incorrect p-2">` +
      `</div>` +
      `<button type="button" class="btn btn-primary btn-block btn-lg nxtBtn">Next</button>` +
      `</div>`
    );
  }

  $(document.getElementsByClassName("question1")).attr('style', 'display:block');
}

// Check whether answer is correct or incorrect
function checkAnswer() {
  totalAnswers++;
  // Progress bar logic from - https://medium.com/javascript-in-plain-english/building-a-progress-bar-in-css-js-html-from-scratch-6449da06042
  var increase = `${(totalAnswers / TOTAL_QUESTIONS) * 100}%`;
  $(progressBarComplete).width(increase);
  selected = $(`input[name=answer]:checked`).next('label').text();
  var correct = correctAnswers(data.results);
  var incorrect = incorrectAnswers(data.results);
  correct = formatCorrect(correct);
  console.log(correct);
  incorrect = formatInCorrect(incorrect);
  console.log(incorrect);
  if (correct.includes(selected)) {
    score++;
    correctIncrease = `${(score / TOTAL_QUESTIONS) * 100}%`;
  }
  for (j = 1; j <= 4; j++) {
    if (correct.includes(selected)) {
      // score++;
      $(`input[id=answer-${j}-q-${totalAnswers}]:checked`).next('label').addClass('correct').append('<i class="fas fa-check p-2"></i>');
    } else if (incorrect.includes(selected)) {
      $(`input[id=answer-${j}-q-${totalAnswers}]:checked`).next('label').addClass('incorrect').append('<i class="fas fa-times p-2"></i>');

      var unSelected = $(`input[id=answer-${j}-q-${totalAnswers}]`).next('label').text();

      if (correct.includes(unSelected)) {
        $(`input[id=answer-${j}-q-${totalAnswers}]`).next('label').addClass('correct').append('<i class="fas fa-check p-2"></i>');
      }
    }
  }
}

// On submit answer - validate if checked, check against answer and retrieve next question
$(document).ready(function () {
  $(quizForm).on('click', '.nxtBtn', function () {
    if (!$('input').is(':checked')) {
      console.log("Not Checked!");
      $('.incorrect').html('Please select an answer to proceed!');
    } else {
      checkAnswer();
      nextQuestion();
      console.log(score);
    }
  });
});


// Fisher-Yates (aka Knuth) Shuffle algorithm - function borrowed in full from: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
// Randomize the array
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

// Append correct answer with the incorrect answers array
function getAnswers(answers) {
  var allAnswers = answers.incorrect_answers.concat(answers.correct_answer);
  return allAnswers;
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

// Load the next question
function nextQuestion() {
  if (totalAnswers < 10) {
    setTimeout(function () {
      $('.incorrect').empty();
      $(document.getElementsByClassName(`question${answeredQuestions}`)).remove();
      $("input").prop("checked", false);
      answeredQuestions++;
      // nextQuestion = document.getElementsByClassName(`question${answeredQuestions++}`);
      $(document.getElementsByClassName(`question${answeredQuestions}`)).attr('style', 'display:block');
    }, 2000);
  } else {
    if (score >= 5) {
      setTimeout(function () {
        $(quizForm).html("" +
          `<i class="fas fa-trophy"></i>` +
          `<div class="success-progress-bar">` +
          `<div class="success-progress-bar-complete">` +
          `</div>` +
          `</div>` +
          `<p class="end-p">Congratulations ${localName}, you have reached the end of the Quiz!</p>` +
          `<p class="end-p">You answered <strong>${score}/10</strong>, well done!</p>` +
          '<hr>' +
          `<button type="button" class="btn btn-primary btn-block btn-lg" id="playAgain" onclick="reloadPage()">Play Again</button>`);
        $(progressBarSuccess).width(correctIncrease);
      }, 2000);
    } else {
      setTimeout(function () {
        $(quizForm).html("" +
          `<i class="fas fa-sad-tear"></i>` +
          `<div class="fail-progress-bar">` +
          `<div class="fail-progress-bar-complete">` +
          `</div>` +
          `</div>` +
          `<p class="end-p">Good attempt ${localName}, you have reached the end of the Quiz!</p>` +
          `<p class="end-p">You answered <strong>${score}/10</strong>, better luck next time!</p>` +
          '<hr>' +
          `<button type="button" class="btn btn-primary btn-block btn-lg" id="playAgain" onclick="reloadPage()">Play Again</button>`);
        $(progressBarFail).width(correctIncrease);
      }, 2000);
    }

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
          `<div class="form-row align-items-center text-center">` +
          `<div class="col-auto my-1">` +
          `<label class="mr-sm-2" for="category">Category</label>` +
          `<select class="custom-select mr-sm-2" id="category">` +
          `<option selected>Select...</option>` +
          `<option value="9">General</option>` +
          `<option value="21">Sports</option>` +
          `<option value="23">History</option>` +
          `<option value="11">Film</option>` +
          `<option value="12">Music</option>` +
          `<option value="17">Science</option>` +
          `<option value="">Anything</option>` +
          '</select>' +
          `</div>` +
          `<div class="col-auto my-1">` +
          `<label class="mr-sm-2" for="difficulty">Diffculty</label>` +
          `<select class="custom-select mr-sm-2" id="difficulty">` +
          `<option selected>Select...</option>` +
          `<option value="1">Easy</option>` +
          `<option value="2">Medium</option>` +
          `<option value="3">Hard</option>` +
          `<option value="">Any diffculty</option>` +
          `</select>` +
          '</div>' +
          `</div>` +
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

// Reload the page
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


// Put all correct answers in an array
function correctAnswers(data) {
  var allCorrect = [];
  for (index = 0; index < data.length; index++) {
    allCorrect.push(data[index].correct_answer);
  }
  return allCorrect;
}

//Put all incorrect answers in an array
function incorrectAnswers(data) {
  var allIncorrect = [];
  for (index = 0; index < data.length; index++) {
    allIncorrect.push(...data[index].incorrect_answers)
  }
  return allIncorrect;
}

// Convert correct answers from HTML entities to text
function formatCorrect(data) {
  var correctFormatted = [];
  for (j = 0; j < data.length; j++) {
    correctStr = $('<textarea/>').html(data[j]).text();
    correctFormatted.push(correctStr);
  }
  return correctFormatted;
}

// Convert incorrect answers from HTML entities to text
function formatInCorrect(data) {
  var incorrectFormatted = [];
  for (j = 0; j < data.length; j++) {
    incorrectStr = $('<textarea/>').html(data[j]).text();
    incorrectFormatted.push(incorrectStr);
  }
  return incorrectFormatted;
}
