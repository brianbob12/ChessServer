//manages the game
//keeps track of wins and loses
//keeps track of points
//keeps trak of players

const Board = require('./Board.js')

class Game{
  constructor(){
    this.board=Board()
    this.moveLog=[]
  }

  //attempts to make a move and loggs it if sucessful
  makeMove(id,newPos){
    let out=this.board.makeMove(id,newPos)
    if(out){
      //log move
      this.moveLog.push([id,newPos])
    }
  }

  resetBoard(){
    this.board=Board()
  }
}
