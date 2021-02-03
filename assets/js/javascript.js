// Variables
var userName = document.getElementById("username");
var loginBtn = document.getElementById("login");
var loginForm = document.getElementById("login-form");
var quizForm = document.getElementById("quiz");
var barFull = document.getElementsByClassName("progress-bar-complete");
var barPass = document.getElementsByClassName("success-progress-bar-complete");
var barFail = document.getElementsByClassName("fail-progress-bar-complete");
var localName;
var loggedIn = false;
var data;
var question;
var answer;
var base_url;
var score = 0;
var totalAnswers = 0;
var answeredQuestions = 1;
var selected;
var unSelected;
var correctIncrease;
var correctStr;
var incorrectStr;
const TOTAL_QUESTIONS = 10;

// Check username and store in localStorage if correct
function checkName() {
  if (userName.value.length == 0) {
    document.getElementById('errors').innerHTML = "Please enter a username!";
    return false;
  } else if (userName.value.length > 0 && userName.value.length <= 12) {
    localStorage.setItem('name', userName.value);
    localName = localStorage.getItem('name');
    return true;
  } else {
    document.getElementById('errors').innerHTML = "Username can be a maximum of 12 characters!";
  }
}

// Display settings for user to choose - difficulty level and category 
function chooseSettings() {
  setTimeout(function () {
    loggedIn = true;
    $(loginForm).children().hide();
    $(loginForm).html("" +
      `<i class="fas fa-check-circle"></i>` +
      `<h1>Let's Quiz-It!</h1>` +
      `<h2>Welcome ${localName}!</h2>` +
      `<hr>` +
      `<div class="form-row align-items-center justify-content-center">` +
      `<div class="col-auto my-1">` +
      `<label class="mr-sm-2" for="difficulty">Difficulty</label>` +
      `<select class="custom-select mr-sm-2" id="difficulty">` +
      `<option selected>Select...</option>` +
      `<option value="1">Easy</option>` +
      `<option value="2">Medium</option>` +
      `<option value="3">Hard</option>` +
      `<option value="">Any difficulty</option>` +
      `</select>` +
      `</div>` +
      `</div>` +
      `<div class="form-row align-items-center justify-content-center">` +
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
      `<option value="">A mix of categories</option>` +
      '</select>' +
      `</div>` +
      `</div>` +
      `<p class="p-2">* If nothing selected a variety of categories and difficulties will be chosen</p>` +
      `<hr>` +
      `<button type="button" class="btn btn-primary btn-block btn-lg startBtn" id="start">Start Quiz</button>`);
  }, 2000);
}


// Validate input and add loader - hide login form elements 
$(document).ready(function () {
  $('#play').click(function () {
    if (checkName() && localName.length > 0) {
      $(this).prop("disabled", true);
      $(this).html(`<span class="spinner-border spinner-border-lg" role="status" aria-hidden="true"></span>`);
      chooseSettings();
    }
  });
});


// Fisher-Yates (aka Knuth) Shuffle algorithm - function borrowed in full from: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
// Randomize the array
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


// Fill form with questions and answers
function fillForm(data) {
  $(loginForm).children().remove();
  $(quizForm).children().remove();
  $('.main-container').append(`<button type="button" class="btn btn-danger reset-btn">Reset</button>`);
  for (i = 0; i < data.length; i += 1) {
    const element = data[i];
    question = data[i].question;
    answer = getAnswers(element);
    shuffle(answer);
    $(quizForm).append("" +
      `<div class="question question${i + 1}" style="display: none;">` +
      `<h2>The Quiz:</h2>` +
      `<div class="progress-bar">` +
      `<div class="progress-bar-complete">` +
      `</div>` +
      `</div>` +
      `<hr>` +
      `<p id="question">Question ${i + 1}:&nbsp;${question}</p>` +
      `<hr>` +
      `<div class="custom-control custom-radio text-left p-3 quiz-content">` +
      `<div class="form-check">` +
      `<input type="radio" id="answer-1-q-${i + 1}" name="answer" class="custom-control-input">` +
      `<label for="answer-1-q-${i + 1}" class="custom-control-label">${answer[0]}</label>` +
      `</div>` +
      `<div class="form-check">` +
      `<input type="radio" id="answer-2-q-${i + 1}" name="answer" class="custom-control-input">` +
      `<label for="answer-2-q-${i + 1}" class="custom-control-label">${answer[1]}</label>` +
      `</div>` +
      `<div class="form-check">` +
      `<input type="radio" id="answer-3-q-${i + 1}" name="answer" class="custom-control-input">` +
      `<label for="answer-3-q-${i + 1}" class="custom-control-label">${answer[2]}</label>` +
      `</div>` +
      `<div class="form-check">` +
      `<input type="radio" id="answer-4-q-${i + 1}" name="answer" class="custom-control-input">` +
      `<label for="answer-4-q-${i + 1}" class="custom-control-label">${answer[3]}</label>` +
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


// Get questions from the API and fill form 
async function sendApiRequest() {
  var category = $("#category option:selected").val();
  var difficulty = $("#difficulty option:selected").text().toLowerCase();
  if (category == "Select...") {
    category = "";
  }
  if (difficulty == "select...") {
    difficulty = "";
  }
  base_url = `https://opentdb.com/api.php?amount=10&type=multiple&`;
  var url = `${base_url}category=${category}&difficulty=${difficulty}`;
  const response = await fetch(url);
  data = await response.json();

  if (!response.ok) {
    var errors_id = document.getElementById("errors");
    $(errors_id).innerHTML = `A ${response.status} error has occurred!`;
  } else {
    fillForm(data.results);
  }
}

// Start quiz on button click - call API function to fill form 
$(document).ready(function () {
  $(loginForm).on('click', '.startBtn', function () {
    $("button").removeClass("active");
    $(this).addClass("active");
    $(this).html(`<span class="spinner-border spinner-border-lg" role="status" aria-hidden="true"></span>`);
    setTimeout(function () {
      sendApiRequest();
    }, 2000);
  });
});


// Check whether answer is correct or incorrect
function checkAnswer() {
  totalAnswers++;
  // Progress bar logic from - https://medium.com/javascript-in-plain-english/building-a-progress-bar-in-css-js-html-from-scratch-6449da06042
  var increase = `${(totalAnswers / TOTAL_QUESTIONS) * 100}%`;
  selected = $(`input[name=answer]:checked`).next('label').text();
  var correct = correctAnswers(data.results);
  var incorrect = incorrectAnswers(data.results);
  correct = formatCorrect(correct);
  console.log(correct);
  incorrect = formatInCorrect(incorrect);
  if (correct.includes(selected)) {
    score++;
    correctIncrease = `${(score / TOTAL_QUESTIONS) * 100}%`;
  }
  for (j = 1; j <= 4; j += 1) {
    if (correct.includes(selected)) {
      $(`input[id=answer-${j}-q-${totalAnswers}]:checked`).next('label').addClass('correct');
    } else if (incorrect.includes(selected)) {
      $(`input[id=answer-${j}-q-${totalAnswers}]:checked`).next('label').addClass('incorrect');

      unSelected = $(`input[id=answer-${j}-q-${totalAnswers}]`).next('label').text();

      if (correct.includes(unSelected)) {
        $(`input[id=answer-${j}-q-${totalAnswers}]`).next('label').addClass('correct');
      }
    }
  }
  $(barFull).width(increase);
}


// Load the next question
function nextQuestion() {
  if (totalAnswers < 10) {
    setTimeout(function () {
      $('.incorrect').empty();
      $('.nxtBtn').prop('disabled', false);
      $("input").prop("checked", false);
      $(document.getElementsByClassName(`question${answeredQuestions}`)).remove();
      answeredQuestions++;
      $(document.getElementsByClassName(`question${answeredQuestions}`)).attr('style', 'display:block');
    }, 2000);
  } else {
    $(".reset-btn").remove();
    $('.main-container').append(`<button type="button" class="btn btn-danger exit-btn" onclick="exitQuiz()">Exit</button>`);
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
          `<button type="button" class="btn btn-primary btn-block btn-lg restart-btn">Play Again</button>`);
        $(barPass).width(correctIncrease);
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
          `<button type="button" class="btn btn-primary btn-block btn-lg restart-btn">Play Again</button>`);
        $(barFail).width(correctIncrease);
      }, 2000);
    }

  }
}


// On submit answer - validate if checked, check against answer and retrieve next question
$(document).ready(function () {
  $(quizForm).on('click', '.nxtBtn', function () {
    $("button").removeClass("active");
    $(this).addClass("active");
    $('.nxtBtn').prop('disabled', true);
    if (!$('input').is(':checked')) {
      $('.incorrect').html('Please select an answer to proceed!');
      $('.nxtBtn').prop('disabled', false);
      $("button").removeClass("active");
    } else {
      checkAnswer();
      nextQuestion();
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


// Exit Quiz and reload the page
function exitQuiz() {
  window.location.reload();
  return false;
}


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
  for (index = 0; index < data.length; index += 1) {
    allIncorrect.push(...data[index].incorrect_answers)
  }
  return allIncorrect;
}


// Convert correct answers from HTML entities to text
function formatCorrect(data) {
  var correctFormatted = [];
  for (j = 0; j < data.length; j += 1) {
    correctStr = $('<textarea/>').html(data[j]).text();
    correctFormatted.push(correctStr);
  }
  return correctFormatted;
}


// Convert incorrect answers from HTML entities to text
function formatInCorrect(data) {
  var incorrectFormatted = [];
  for (j = 0; j < data.length; j += 1) {
    incorrectStr = $('<textarea/>').html(data[j]).text();
    incorrectFormatted.push(incorrectStr);
  }
  return incorrectFormatted;
}


// Append correct answer with the incorrect answers array
function getAnswers(answers) {
  var allAnswers = answers.incorrect_answers.concat(answers.correct_answer);
  return allAnswers;
}


// Change background-color of button on click
$(document).ready(function () {
  $("button").click(function () {
    $("button").removeClass("active");
    $(this).addClass("active");
  });
});


// Reset the quiz on click of 'Reset' button
$(".main-container").on('click', '.reset-btn', function () {
  totalAnswers = 0;
  answeredQuestions = 1;
  score = 0;
  $(quizForm).children().remove();
  $(quizForm)[0].reset();
  $(loginForm).html("" +
    `<h1>Resetting Quiz!</h1>` +
    `<h2 class="correct">One moment, please..</h2>` +
    `<span class="spinner-border spinner-border-lg" role="status" aria-hidden="true"></span>`);
  chooseSettings();
});


// Restart the quiz on click of 'Play Again' button
$(".main-container").on('click', '.restart-btn', function () {
  $(".exit-btn").remove();
  totalAnswers = 0;
  answeredQuestions = 1;
  score = 0;
  $(quizForm).children().remove();
  $(quizForm)[0].reset();
  $(loginForm).html("" +
    `<h1>Restarting Quiz-It!</h1>` +
    `<h2 class="correct">One moment, please..</h2>` +
    `<span class="spinner-border spinner-border-lg" role="status" aria-hidden="true"></span>`);
  chooseSettings();
});
