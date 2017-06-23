const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const fs = require('fs');
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

const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
const letters = ["none"]
const word = words[(Math.floor(Math.random() * words.length))];
var spaces = []
const displayWord = function(){
  for(i = 0; i < word.length; i++){
    spaces.push("_");
  };
  return spaces.join(" ");
};
const tags = {num: 8, word: displayWord, letters: letters}
// var tags = [req.body.num, req.body.word, req.body.letters]

app.get("/", function(req, res){
  if(!req.session.word){
    req.session.word = word;
    console.log(req.session.word);
  }
  res.render("home", {tags: tags});
});




app.listen(3000, function(){
  console.log("Hey, Listen!")
});
