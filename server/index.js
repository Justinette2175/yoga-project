"use strict";

const express = require('express');
const PORT = 8080;
const bodyParser    = require("body-parser");
const app = express();
const morgan  = require('morgan');
var AppearIn = require("appearin-sdk");
var appearin = new AppearIn();

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});