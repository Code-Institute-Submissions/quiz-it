# [Quiz-It Trivia Game](https://seamusmacg.github.io/quiz-it)

!["This application was tested for responsiveness on mutiple devices"](https://github.com/seamusmacg/quiz-it/blob/master/images/quiz-it-mockup.PNG)

---

## Table of Contents

## Project Overview
Quiz-It is a simple quiz trivia game that tests a user's knowledge on a variety of topics. A user can select a Category and a Difficulty, they are then presented with ten questions (one question at a time) that they must answer. At the end of the questions they are given their score out of ten. A score of five or above is considered a pass and a score of five or below is considered a fail. 

The questions are generated using an open source trivia API from [Open Trivia Database](https://opentdb.com/api_config.php)

A user must login with their username and password in order to play the game. They can logout at any time.

Any username can be used and the default password is: **password**

## UX

### Strategy

#### User Stories
- As a user, I want the application to test my knowledge on a variety of topics.
- As a user, I want the application to provide a choice on the category and difficulty level I will be tested on. 
- As a user, I want an application that will provide results on the number of questions answered correctly or incorrectly. 
- As a user , I want confirmation from the application whether I've logged in successfully or unsuccessfully. 

### Scope/Features 

### Features
- Main login form - contains app logo and name, including a brief description of the game and instructions. Login features are username and password inputs.   
- Successful login form - contains confirmation and welcome message, Difficulty and Category selections. A 'Start Quiz' button to set up the quiz form section.  
- Unsuccessful login - contains confirmation and try again message.  A 'Try Again' button to reset the game. 
- Quiz form - contains quiz title, question (numbered) with four possible answers to select as radio buttons. A progress bar to display the number of questions answered. A 'Next' button to display next question, also shows whether the answer is correct or incorrect. 

### Structure 
The application is displayed on one page which is dynamically loaded based on user actions. The content of the page is contained in two forms - a login form and quiz form. The structure is focused on providing the information to the user in a presentable format and with intuitive design. 

### Skeleton

I used [Balsamiq](https://balsamiq.com) to create a wireframe for each event presented to the user. 

- [Login Form](https://github.com/seamusmacg/quiz-it/blob/master/images/login-wireframe.png)
- [Login Form Success](https://github.com/seamusmacg/quiz-it/blob/master/images/login-success-wireframe.png)
- [Login Form Failure](https://github.com/seamusmacg/quiz-it/blob/master/images/login-failure-wireframe.png)
- [Quiz Form Question](https://github.com/seamusmacg/quiz-it/blob/master/images/question-wireframe.png)
- [Quiz Form Pass](https://github.com/seamusmacg/quiz-it/blob/master/images/quiz-pass-wireframe.png)
- [Quiz Form Fail](https://github.com/seamusmacg/quiz-it/blob/master/images/quiz-fail-wireframe.png)

The application's layout aims for intuitive design where the user knows how to proceed based what they see. 
