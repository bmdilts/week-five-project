const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const fs = require('fs');
const validator = require('express-validator');
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', './views');
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use('/public', express.static('public'));
app.use(validator());

const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
const word = words[(Math.floor(Math.random() * words.length))];
const letters = ["none"]
const wordUp = word.toUpperCase();
const wordArr = (wordUp.split(""));
spaces = [];
var displayWord = "";

function x(){
    for(i = 0; i < word.length; i++){
      spaces.push("_");
    };
    return spaces;
};

x();
// var displayWord = spaces.join(" ");

const tags = {num: 8, word: displayWord, letters: letters};

// var tags = [req.body.num, req.body.word, req.body.letters]

app.get("/", function(req, res){
  if(!req.session.word){
    req.session.word = word;
    req.session.num = 8;
    req.session.letters = [];
    console.log(req.session.word);
  }
  req.session.displayWord = spaces.join(" ");
  const tags = {num: req.session.num, word: req.session.displayWord, letters: req.session.letters};
  res.render("home", {tags: tags});
});

app.post("/", function(req, res){
  req.checkBody('input', 'Invalid guess!')
    .isLength({max: 1})

  const errors = req.validationErrors();
  var input = req.body.input.toUpperCase();
  if (errors) {
    res.send(errors);
  } else if (req.session.letters.includes(input)){
      console.log("Letter already guessed, try again!");
      input = "";
  } else if(wordArr.includes(input)){
    for(let i = 0; i < wordArr.length; i++){
      if(wordArr[i] === input){
        spaces.splice(i, 1, input);
        req.session.displayWord = spaces.join(" ");
      }
    }
  } else {
      req.session.num--;
    };

  if(input !== ""){
    req.session.letters.push(input);
  };

  if(req.session.num === 0){
    console.log("You lose!")
  };

  if(!req.session.displayWord.includes("_")){
    console.log("You win!")
  };
  res.redirect('/');
});



app.listen(3000, function(){
  console.log("Hey, Listen!")
});
