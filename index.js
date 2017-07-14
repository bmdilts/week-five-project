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

const words = fs.readFileSync("./data/words", "utf-8").toLowerCase().split("\n");

// var word = words[(Math.floor(Math.random() * words.length))];
// const letters = ["none"]
// const wordUp = word.toUpperCase();
// const wordArr = (wordUp.split(""));
// var spaces = [];
var displayWord = "";

// function x(){
//     for(i = 0; i < word.length; i++){
//       spaces.push("_");
//     };
//     return spaces;
// };
//
// x();
// var displayWord = spaces.join(" ");

// const tags = {num: 8, word: displayWord, letters: letters};

// var tags = [req.body.num, req.body.word, req.body.letters]

app.get('/', function(req, res){
  if(!req.session.word){
    var word = words[(Math.floor(Math.random() * words.length))];
    spaces = [];
    function x(){
      for(let i = 0; i < word.length; i++){
        spaces.push('_');
      }
      return spaces;
    }
    x();
    const wordUp = word.toUpperCase();
    req.session.wordArr = (wordUp.split(''));
    req.session.word = word;
    req.session.num = Math.ceil(word.length * 0.6);
    req.session.num2 = Math.ceil(word.length * 0.6);
    req.session.letters = [];
    req.session.win = true;
    req.session.msg = '';
    req.session.loserWord = '';
    req.session.loser = '';
    if(!req.session.purple){
      req.session.purple = 0;
    }
    console.log(req.session.word);
  }
  req.session.displayWord = spaces.join(' ');
  const tags = {num: req.session.num, word: req.session.displayWord, letters: req.session.letters, win: req.session.win, msg: req.session.msg, loser: req.session.loser, purple: req.session.purple};
  res.render('home', {tags: tags});
});


app.post('/', function(req, res){
  req.checkBody('input', 'Invalid guess!')
    .isLength({min: 1, max: 1})

  req.session.loser = "";
  const errors = req.validationErrors();
  var input = req.body.input.toUpperCase();
  if (errors) {
    res.send(errors);
  } else if (req.session.letters.includes(input)){
      req.session.loser = 'Letter already guessed, try again!';
      input = '';
  } else if(req.session.wordArr.includes(input)){
    for(let i = 0; i < req.session.wordArr.length; i++){
      if(req.session.wordArr[i] === input){
        spaces.splice(i, 1, input);
        req.session.displayWord = spaces.join(' ');
      }
    }
  } else {
      req.session.num--;
    }
  if(input !== ''){
    req.session.letters.push(input);
  }
  if(!req.session.displayWord.includes('_')){
    req.session.win = false;
    req.session.msg = 'You win!';
    req.session.loser = 'You win!';
    req.session.purple += req.session.num;
  }
  if(req.session.num === 0){
    req.session.win = false;
    req.session.msg = 'You lose!';
    req.session.loser = req.session.word;
    req.session.purple -= req.session.num2;
  }
  res.redirect('/');
});

app.post('/again', function(req, res){
  req.session.word = null;
  res.redirect('/')
});

app.listen(process.env.PORT || 3000, function(){
  console.log('Hey, Listen!')
});
