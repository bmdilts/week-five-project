const express = require('express');
const app = express();
const bodyParser = require(body-parser);
const mustache = require(mustache-express);
const session = require(express-session);
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




app.listen(3000, function(){
  console.log("Hey, Listen!")
});
