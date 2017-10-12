
var fs = require("fs");

module.exports = BasicFlashcard;

// constructor for BasicFlashcard
function BasicFlashcard(front, back) {
    this.front = front;
    this.back = back;
    this.create = function() {
        // flashcard object to be appended to file
        var data = {
            type: "basic",
            front: this.front,
            back: this.back    
        };
        // add card to log.txt
        fs.appendFile("log.txt", JSON.stringify(data, null,2) + ';', "utf8", function(error) {
            // if there is an error, log the error
            if (error) {
                console.log(error);
            }
        });
    };
}