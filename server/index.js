"use strict";

const express = require('express');
const PORT = 8080;
const bodyParser    = require("body-parser");
const app = express();
const morgan  = require('morgan');
var AppearIn = require("appearin-sdk");
var appearin = new AppearIn();
var cookieSession = require('cookie-session')
const bcrypt = require('bcrypt');
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
}))
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

var users = {};

function generateRandomString(n){
  const charSet = "1234567890abcdefghijklmnopqrstuvwxyz";
  let randomString = "";
  for (var i = 0; i < n; i++){
    let rnum = Math.floor(Math.random() * charSet.length);
    randomString += charSet[rnum];
  }
  return randomString;
};

function emailExists(email, users){
  for (user in users){
    if (email === users[user].email){
      return user;
    }
    else {
      return false;
    }
  }
}


app.post("/registration", (req, res) =>{
  const userId = generateRandomString(8);
  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password, 10);
  for (user in users){
    if(users[user].email === email){
      res.status(400).send("This email already has an account registered");
    }
  }
  users[userId] = {
    _id : userId,
    email : email,
    password : password
  }
  req.session["user_id"] = userId;
  console.log(users);
  res.redirect("/");
})

app.post("/login", (req, res)=>{
  const email = req.body.email;
  const password = req.body.password;
  if(!emailExists(email)){
    res.status(403).send("This email is not registered with us");
  }
  else {
    const user =  emailExists(email);
    const userId = user[_id];
    if (bcrypt.compareSync(password, users[userId]["password"])){
      req.session["user_id"] = userId;
      res.redirect('/');
    }
    else{
      res.status(403).send("Invalid email / password combination");
    }
  }
})


app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});