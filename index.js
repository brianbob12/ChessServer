"use strict";

//import board and peices
const Board = require('./src/Board.js')

const bodyParser=require("body-parser");

//setup express js
const express = require("express");
var app = express();
//app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

//setup board
let board= new Board()

//render home page
app.get("/getboard",function(req,res) {
  res.json(board.layout)
  res.end()
});



app.listen(80)
