"use strict";

//import board and peices
const Board = require('./src/Board.js')

const bodyParser=require("body-parser")

//setup express js
const express = require("express")
var app = express()
//app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}))

//globals
let board= new Board()


function setup(){
  //setup board
  board= new Board()
}

//setup
setup()

//render home page
app.get("/getboard",function(req,res) {
  res.json(board.layout)
  res.end()
})

app.get("/verifyMove",function(req,res){
  console.log("Move Verrification")

  try{
    let out=board.checkMove(req.query.id,req.query.newpos)
    res.write(out.toString())
    res.end()
  }
  catch{
    console.log(e)
    res.write("ERROR")
    res.end()
  }
})


app.listen(80)
