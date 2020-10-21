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
  console.log("Setting up board")
  board= new Board()
  console.log("Ready!")
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


app.get("/makeMove",function(req,res){
  console.log("Making Move")
  try{
    let out=board.makeMove(req.query.id,req.query.newpos)
    //// TODO: log move
    if(!out){
      console.log("attemtp to make illegal move")
    }
    res.write(out.toString())
    res.end()
  }
  catch(error){
    console.log(error)
    res.write("ERROR")
    res.end()
  }
})


app.listen(80)
