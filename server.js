console.log("hey");
const express = require('express');
const bodyParser= require('body-parser')
const app = express();
app.use(bodyParser.urlencoded({extended: true}))
const MongoClient = require('mongodb').MongoClient
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

// Connect to DB
//var configDB = require('./config/database.js');
mongoose.connect('mongodb://malbinson:malbinson1@ds119503.mlab.com:19503/albinson');


var db
MongoClient.connect('mongodb://phildierks:4phillip@ds049538.mlab.com:49538/classhelper', (err, client) => {
  if (err) return console.log(err)
   db = client.db('need')
   app.listen(3000, () => {
     console.log('listening on 3000')
   })
   app.get('/', (req, res) => {
     var cursor = db.collection('need').find()
   })
   db.collection('need').find().toArray(function(err, result) {
     console.log(result)
   })
 })

 app.get('/', (req, res) => {
   db.collection('need').find().toArray((err, result) => {
     if (err) return console.log(err)
     res.render('index.ejs', {food: result})
   })
 })

 app.post('/need', (req, res) => {
   db.collection('need').find().toArray(function(err,result){
     var id = result.length+1
     var need = req.body.need
     var name = req.body.user
     db.collection('need').insertOne({name:name, need:need, id:id})
     console.log(result)
     res.redirect('/')
   })
})

app.post('/delete', function(req, res) {
  var id = parseInt(req.body.buttonId)
  console.log(id)
  db.collection("need").deleteOne({id:id})
  res.redirect("/")
})


app.post('/update', (req,res) => {
  var id = parseInt(req.body.buttonId2)
  db.collection('need').find({id:id}).toArray(function(err,result){
    var id1 = parseInt(req.body.buttonId2)
    console.log(result)
    var need = result[0].need
    var name = result[0].name
    console.log(need)
    console.log(id)
    res.render('edit.ejs', {name:name, need:need, editId:id1})
   })
});

app.post('/update2', function(req, res) {
  var Id = parseInt(req.body.editId)
  var newName = req.body.user
  var newNeed = req.body.need
  console.log(Id)
  db.collection('need').updateOne({id:Id},
      { $set: {name:newName, need: newNeed}},
       (err, res) => {
      if (err) throw err;
      console.log("updated");
    })
    res.redirect('/');
});

// set up our express application
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
// load our routes and pass in our app and fully configured passport
require('./app/routes.js')(app, passport);
require('./config/passport')(passport); // pass passport for configuration
