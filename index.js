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
const displayWord = function(){
  for(i = 0; i < word.length; i++){
    let spaces = 
  }
}
const tags = {num: 8, word: word, letters: letters}
// var tags = [req.body.num, req.body.word, req.body.letters]

app.get("/", function(req, res){
  if(!req.session.word){
    req.session.word = word;
  }
  res.render("home", {tags: tags});
});




app.listen(3000, function(){
  console.log("Hey, Listen!")
});
