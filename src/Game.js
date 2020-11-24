//manages the game
//keeps track of wins and loses
//keeps track of points
//keeps trak of players

const Board = require('./Board.js')

class Game{
  //codeA and codeB are keys needed to place a move for A or B

  constructor(codeA,codeB){ 
    this.moveLog=[]
    this.codeA=codeA
    this.codeB=codeB
  }
 
  //a function to start the game
  //if aFirst==true then A moves first
  startGame(aFirst){
    this.aMove=true
    this.board=new Board()
  }

  //attempts to make a move and loggs it if sucessful
  makeMove(id,newPos,code){
    //check if code is valid
    if(code===this.codeA){
      if(!this.aMove){
        return "B move"
      }
    } 
    else if(code===this.codeB){
      if(this.aMove){
        return "A move"
      }
    }
    else{
      return "INVALID CODE"
    }
    let out = this.board.makeMove(id,newPos)
    if(out){
      //log move
      this.moveLog.push([id,newPos])
      this.aMove=!this.aMove
      return "OK"
    }
    return "ILLIGAL MOVE" 
  }

  resetBoard(){
    this.board=Board()
  }
  
}

module.exports = Game
