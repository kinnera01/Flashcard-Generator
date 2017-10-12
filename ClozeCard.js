

// module.exports = ClozeCard;
var fs = require("fs");

module.exports = ClozeFlashcard;

// constructor for ClozeFlashcard
function ClozeFlashcard(text, cloze) {
    this.text = text;
    this.cloze = cloze;
    this.clozeDeleted = this.text.replace(this.cloze, '_____');
    this.create = function() {
        var data = {
            type: "cloze",
            text: this.text,
            cloze: this.cloze,
            clozeDeleted: this.clozeDeleted
           
        };
        // add card to log.txt
        fs.appendFile("log.txt", JSON.stringify(data,null,2) + ';', "utf8", function(error) {
            // if there is an error, log the error
            if (error) {
                console.log(error);
            }
        });
    };
}