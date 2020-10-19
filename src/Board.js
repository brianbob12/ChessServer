//the board is made up of peices. Each peice has an id and class

//There are two sides, A and B
//NOTE A starts at a low Y vale and B starts at a high Y value
//peice IDs starting with A belong to player A

//import Peice
const Peice = require('./Piece.js')

class Board {
  //sets up chess board as usual.



  constructor(){
    this.layout={}//a dictionary of locations to piece IDs
    //the botton left corner is represented by "00"
    //the top right corner is represented by "77"
    //if an place is empty the value is ""

    //cover layout with empty squares
    for(var x=0;x<8;x++){
      for(var y=0;y<8;y++){
        this.layout[x.toString()+y.toString()]=""
      }
    }

    this.allPieces=[]//list of all piece IDs

    this.idLookup={}//a dictionary of peiceIDs to peice objects

    //setupTeams
    console.log("Setting up board")
    this.setUpSide("A",true)
    this.setUpSide("B",false)

  }

  //to be used privatly
  //sets up one team
  setUpSide(letter,bottom){
    //important variables
    var pawnY=1
    var pieceY=0
    if(!bottom){
      pawnY=6
      pieceY=7
    }

    //temporary variables
    var id=""
    var p=null

    //start with pawns
    for(var x=0;x<8;x++){
      //create new peice
      id=letter+"P"+x.toString()
      p=new Peice(letter,id,5,x,pawnY)

      //add to globals
      this.allPieces.push(id)
      this.idLookup[id]=p
      this.layout[x.toString()+pawnY.toString()]=id
    }

    //add rooks
    id=letter+"R0"
    p=new Peice(letter,id,4,0,pieceY)
    //add to globals
    this.allPieces.push(id)
    this.idLookup[id]=p
    this.layout["0"+pieceY.toString()]=id

    id=letter+"R1"
    p=new Peice(letter,id,4,7,pieceY)
    //add to globals
    this.allPieces.push(id)
    this.idLookup[id]=p
    this.layout["7"+pieceY.toString()]=id

    //add knights
    id=letter+"N0"
    p=new Peice(letter,id,3,1,pieceY)
    //add to globals
    this.allPieces.push(id)
    this.idLookup[id]=p
    this.layout["1"+pieceY.toString()]=id

    id=letter+"N1"
    p=new Peice(letter,id,3,6,pieceY)
    //add to globals
    this.allPieces.push(id)
    this.idLookup[id]=p
    this.layout["6"+pieceY.toString()]=id

    //add bishops
    id=letter+"B0"
    p=new Peice(letter,id,2,2,pieceY)
    //add to globals
    this.allPieces.push(id)
    this.idLookup[id]=p
    this.layout["2"+pieceY.toString()]=id

    id=letter+"B1"
    p=new Peice(letter,id,2,5,pieceY)
    //add to globals
    this.allPieces.push(id)
    this.idLookup[id]=p
    this.layout["5"+pieceY.toString()]=id

    //add queen
    id=letter+"Q0"
    p=new Peice(letter,id,1,3,pieceY)
    //add to globals
    this.allPieces.push(id)
    this.idLookup[id]=p
    this.layout["3"+pieceY.toString()]=id

    //add king
    id=letter+"K0"
    p=new Peice(letter,id,0,4,pieceY)
    //add to globals
    this.allPieces.push(id)
    this.idLookup[id]=p
    this.layout["4"+pieceY.toString()]=id
  }

  //boolean function that returns if a square is occupied by a piece of
  //the given team
  occupiedBySide(x,y,side){
    let id=this.layout[x.toString()+y.toString()]
    if (id==""||id==undefined){
      return false
    }
    else{
      if(this.idLookup[id].side==side){
        return true
      }
      else{
        return false
      }
    }
  }

  //gets all possible moves of a piece
  getPossibleMovesPerPiece(id){
    var myPiece=this.idLookup[id]
    var type=myPiece.type
    var direction=1//the forward direction for pawns
    if(myPiece.side=="B"){
      direction=-1
    }

    var possibleMoves=[]//a list of places to move to each item is a list of [x,y]
    //check pawns first because pawns are the most common
    if(type==5){
      //check if blocked by friendly piece
      if(!this.occupiedBySide(myPiece.posX,myPiece.posY+direction,myPiece.side)
      &&myPiece.posY+direction<8&&myPiece.posY+direction>=0){
        possibleMoves.push([myPiece.posX,myPiece.posY+direction])
        //check if pawn can move two squres
        if(!myPiece.hasMoved){
          if(!this.occupiedBySide(myPiece.posX,myPiece.posY+direction*2,myPiece.side)){
            possibleMoves.push([myPiece.posX,myPiece.posY+direction*2])
          }
        }
      }
    }
    //rooks
    else if (type==4) {
      //select all four directions
      var directions=[[-1,0],[1,0],[0,-1],[0,1]]

      var stepX=myPiece.posX
      var stepY=myPiece.posY

      for(var i=0;i<4;i++){
        stepX=myPiece.posX+directions[i][0]
        stepY=myPiece.posY+directions[i][1]
        while(!this.occupiedBySide(stepX,stepY,myPiece.side)&&stepX<8&&
        stepX>=0&&stepY<8&&stepY>=0){
          possibleMoves.push([stepX,stepY])
          stepX+=directions[i][0]
          stepY+=directions[i][1]
        }
      }
    }
    //knights
    else if(type==3){
      //select all eight directions
      var directions=[[-2,-1],[-2,1],[2,-1],[2,1],[-1,-2],[1,-2],[-1,2],[1,2]]

      var stepX=myPiece.posX
      var stepY=myPiece.posY

      for(var i=0;i<8;i++){
        stepX=myPiece.posX+directions[i][0]
        stepY=myPiece.posY+directions[i][1]
        if(!this.occupiedBySide(stepX,stepY,myPiece.side)&&stepX<8&&
        stepX>=0&&stepY<8&&stepY>=0){
          possibleMoves.push([stepX,stepY])
        }
      }
    }
    //bishops
    else if(type==2){
      //select all four directions
      var directions=[[-1,-1],[-1,1],[1,-1],[1,1]]

      var stepX=myPiece.posX
      var stepY=myPiece.posY

      for(var i=0;i<4;i++){
        stepX=myPiece.posX+directions[i][0]
        stepY=myPiece.posY+directions[i][1]
        while(!this.occupiedBySide(stepX,stepY,myPiece.side)&&stepX<8&&
        stepX>=0&&stepY<8&&stepY>=0){
          possibleMoves.push([stepX,stepY])
          stepX+=directions[i][0]
          stepY+=directions[i][1]
        }
      }
    }
    //queen
    else if(type==1){
      //select all eight directions
      var directions=[[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]]

      var stepX=myPiece.posX
      var stepY=myPiece.posY

      for(var i=0;i<8;i++){
        stepX=myPiece.posX+directions[i][0]
        stepY=myPiece.posY+directions[i][1]
        while(!this.occupiedBySide(stepX,stepY,myPiece.side)&&stepX<8&&
        stepX>=0&&stepY<8&&stepY>=0){
          possibleMoves.push([stepX,stepY])
          stepX+=directions[i][0]
          stepY+=directions[i][1]
        }
      }
    }
    //king
    else if(type==0){
      //select all eight directions
      var directions=[[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]]

      var stepX=myPiece.posX
      var stepY=myPiece.posY

      for(var i=0;i<8;i++){
        stepX=myPiece.posX+directions[i][0]
        stepY=myPiece.posY+directions[i][1]
        if(!this.occupiedBySide(stepX,stepY,myPiece.side)&&stepX<8&&
        stepX>=0&&stepY<8&&stepY>=0){
          possibleMoves.push([stepX,stepY])
        }
      }
    }
    return possibleMoves
  }

  //gets all possible moves for a side
  getPossibleMovesPerSide(side){
    //iterate over peiceIDs
  }
}

module.exports = Board
