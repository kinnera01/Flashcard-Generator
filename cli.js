var BasicFlashcard = require('./BasicCard.js');
// require cloze flashcard module
var ClozeFlashcard = require('./ClozeCard.js');
// require inquirer for getting user input at command line
var inquirer = require('inquirer');
// require fs
var colors = require('colors');
var fs = require('fs');
// var Color = require('color');
inquirer.prompt([{
    name: 'command',
    message: 'What would you like to do?'.blue,
    type: 'list',
    choices: [{
        name: 'add-flashcard'.red
    }, {
        name: 'show-all-cards'.green
    }]
}]).then(function (answer) {
    if (answer.command === 'add-flashcard'.red) {
        addCard();
    } else if (answer.command === 'show-all-cards'.green) {
        showCards();
    }
});

var addCard = function () {
    // get user input
    inquirer.prompt([{
        name: 'cardType',
        message: 'What kind of flashcard would you like to create?'.green,
        type: 'list',
        choices: [{
            name: 'basic-flashcard'
        }, {
            name: 'cloze-flashcard'
        }]
        // once user input is received
    }]).then(function (answer) {
        if (answer.cardType === 'basic-flashcard') {
            inquirer.prompt([{
                name: 'front',
                message: 'What is the question?'.yellow,
                validate: function (input) {
                    if (input === '') {
                        console.log('Please provide a question');
                        return false;
                    } else {
                        return true;
                    }
                }
            }, {
                name: 'back',
                message: 'What is the answer?'.red,
                validate: function (input) {
                    if (input === '') {
                        console.log('Please provide an answer');
                        return false;
                    } else {
                        return true;
                    }
                }
            }]).then(function (answer) {
                var newBasic = new BasicFlashcard(answer.front, answer.back);
                newBasic.create();
                whatsNext();
            });
        } else if (answer.cardType === 'cloze-flashcard') {
            inquirer.prompt([{
                name: 'text',
                message: 'What is the full text?'.red,
                validate: function (input) {
                    if (input === '') {
                        console.log('Please provide the full text'.cyan);
                        return false;
                    } else {
                        return true;
                    }
                }
            }, {
                name: 'cloze',
                message: 'What is the cloze portion?'.yellow,
                validate: function (input) {
                    if (input === '') {
                        console.log('Please provide the cloze portion'.cyan);
                        return false;
                    } else {
                        return true;
                    }
                }
            }]).then(function (answer) {
                var text = answer.text;
                var cloze = answer.cloze;
                if (text.includes(cloze)) {
                    var newCloze = new ClozeFlashcard(text, cloze);
                    newCloze.create();
                    whatsNext();
                } else {
                    console.log('The cloze portion you provided is not found in the full text. Please try again.'.red);
                    addCard();
                }
            });
        }
    });
};

var whatsNext = function () {
    // get user input
    inquirer.prompt([{
        name: 'nextAction',
        message: 'What would you like to do next?'.blue,
        type: 'list',
        choices: [{
            name: 'create-new-card'.green
        }, {
            name: 'show-all-cards'.yellow
        }, {
            name: 'nothing'.rainbow
        }]
        // once user input is received
    }]).then(function (answer) {
        if (answer.nextAction === 'create-new-card') {
            addCard();
        } else if (answer.nextAction === 'show-all-cards') {
            showCards();
        } else if (answer.nextAction === 'nothing') {
            return;
        }
    });
};

var showCards = function () {
    // read the log.txt file
    fs.readFile('./log.txt', 'utf8', function (error, data) {
        //if there is an error, log it
        if (error) {
            console.log('Error occurred: ' + error);
        }
        var questions = data.split(';');
        var notBlank = function (value) {
            return value;
        };
        questions = questions.filter(notBlank);
        var count = 0;
        showQuestion(questions, count);

    });
};
var count=0;
var correct=0;
var wrong=0;
var showQuestion = function (array, count) {
    if (count < array.length) {
        question = array[count];
        var parsedQuestion = JSON.parse(question);
        if (parsedQuestion.type === 'basic') {
            questionText = parsedQuestion.front;
            correctReponse = parsedQuestion.back;
            // console.log("Question Basic: " + questionText);
            inquirer.prompt([{
                name: 'response',
                message: questionText,
                type: "input"
            }]).then(function (answer) {
                if (answer.response === correctReponse) {
                    console.log('You Nailed It!'.green);
                    correct++;
                } else {
                    console.log('Wrong!'.red);
                    console.log ("Correct Answer : "+ correctReponse );
                    wrong++;
                };
                count++;
                showQuestion(array, count);
            });
        } else if (parsedQuestion.type === 'cloze') {
            // console.log(parsedQuestion);
            questionText = parsedQuestion.clozeDeleted;
            correctReponse = parsedQuestion.cloze;
            // console.log("Question: " + questionText);
            inquirer.prompt([{
                type: "input",
                name: 'response',
                message: questionText
            }]).then(function (answer) {
                if (answer.response === correctReponse) {
                    console.log('You Nailed It!'.green);
                    correct++;
                } else {
                    console.log('Wrong!'.red);
                    console.log ("Correct Answer : "+correctReponse);
                    wrong++;
                };
                count++;
                showQuestion(array, count);

            });
        };
    } else{
 console.log("CORRECT :"+correct);
 console.log("WRONG :"+wrong);
 inquirer.prompt([{
    name: 'command',
    message: 'What would you like to do?'.blue,
    type: 'list',
    choices: [{
        name: 'add-flashcard'.red
    }, {
        name: 'show-all-cards'.green
    },
{
    name:'quit'
}]
}]).then(function (answer) {
    if (answer.command === 'add-flashcard'.red) {
        addCard();
    } else if (answer.command === 'show-all-cards'.green) {
        showCards();
    }else if(answer.command === 'quit'.yellow){
        whatsNext();
    }
});
}
}
