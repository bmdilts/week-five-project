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


function x(){
    spaces = []
    for(i = 0; i < word.length; i++){
      spaces.push("_");
    };
    displayWord = spaces.join(" ");
    return spaces;
};

x();

const tags = {num: 8, word: spaces, letters: letters}

// var tags = [req.body.num, req.body.word, req.body.letters]

app.get("/", function(req, res){
  if(!req.session.word){
    req.session.word = word;
    console.log(req.session.word);
  }
  res.render("home", {tags: tags});
});
app.post("/", function(req, res){
  req.checkBody('input', 'Invalid guess!')
    .isLength({max: 1})

  const errors = req.validationErrors();
  var input = req.body.input.toUpperCase();
  console.log(input);

  if (errors) {
    res.send(errors);
  } else if (letters.includes(input)){
      console.log("Letter already guessed, try again!");
      input = "";
      console.log(input)
  } else if(wordArr.includes(input)){
    for(let i = 0; i < wordArr.length; i++){
      if(wordArr[i] === input){
        spaces.splice(i, 1, input);
        console.log(spaces);
        displayWord = spaces.join(" ");
      }
    }
  } else {
      tags.num--;
    }
  if(input !== ""){
    letters.push(input);
  }
  res.redirect('/');
});

// spaces.splice(wordArr.findIndex(input), 1 input)


app.listen(3000, function(){
  console.log("Hey, Listen!")
});
