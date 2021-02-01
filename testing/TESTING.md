# Manual Testing 

## Functionality 

### Buttons

| Component | Intended Function | Works as Intended? | Fix |
| -------------- | ------------------- | ---------------- | --- |
|**Login Button** | Validates user inputs, return errors or logs user in | Yes | N/A |
|**Start Quiz Button** | Calls API and loads question one of the quiz | Yes | N/A |
|**Next Button** | Validates if input is checked return error if not.| Yes | N/A |
|**Next Button** |Checks if answer is correct and displays if incorrect | No | Some answers not returning as correct due to encoding issue. Created functions to properly encode the answers.
|**Next Button** | Show correct and/or incorrect answer before next question or before end of quiz | No | Last question not showing answers before result section. Added timer function to show answer before results are displayed |
|**Logout Button** | Reset the page and show login form | Yes | N/A |
|**Play Again Button** | Reset the page and show login form | Yes | N/A |

### Hover/Focus/Click Effects 

| Component | Intended Function | Works as Intended? | Fix |
| -------------- | ------------------- | ---------------- | --- |
| Username/Password input select | Applies thick blue border around input | Yes | N/A |
| Login, Start Quiz, Next, Play Again Buttons | Changes to lighter blue on hover | Yes | N/A |
| Login, Start Quiz, Next, Play Again Buttons | Changes to lighter blue on click | Yes | N/A |
| Login Button | Shows spinner animation on click | Yes | N/A |
| Logout Button | Changes to a lighter red on hover | Yes | N/A |
| Logout Button | Changes to a lighter red on click | Yes | N/A |

## Usability 

Usability tests were carried out based on user stories as outlined in the README.md file. 

### User Story #1

- As a user , I want confirmation from the application whether I've logged in successfully or unsuccessfully. 

The user is presented with a simple confirmation message when they login where it is clear how they should proceed. The "Logout" button also indicates their logged in status throughout the quiz. 

!["Successful login message shown to user"](https://github.com/seamusmacg/quiz-it/blob/master/images/login-success.PNG) !["Unsuccessful login message shown to user"](https://github.com/seamusmacg/quiz-it/blob/master/images/login-failure.PNG)





