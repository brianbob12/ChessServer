//the board is made up of pieces. Each piece has an id and class

//There are two sides, A and B
//NOTE A starts at a low Y vale and B starts at a high Y value
//piece IDs starting with A belong to player A

//import piece
const Piece = require('./Piece.js')

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

    this.idLookup={}//a dictionary of pieceIDs to piece objects

    //setupTeams

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
      //create new piece
      id=letter+"P"+x.toString()
      p=new Piece(letter,id,5,x,pawnY)

      //add to globals
      this.allPieces.push(id)
      this.idLookup[id]=p
      this.layout[x.toString()+pawnY.toString()]=id
    }

    //add rooks
    id=letter+"R0"
    p=new Piece(letter,id,4,0,pieceY)
    //add to globals
    this.allPieces.push(id)
    this.idLookup[id]=p
    this.layout["0"+pieceY.toString()]=id

    id=letter+"R1"
    p=new Piece(letter,id,4,7,pieceY)
    //add to globals
    this.allPieces.push(id)
    this.idLookup[id]=p
    this.layout["7"+pieceY.toString()]=id

    //add knights
    id=letter+"N0"
    p=new Piece(letter,id,3,1,pieceY)
    //add to globals
    this.allPieces.push(id)
    this.idLookup[id]=p
    this.layout["1"+pieceY.toString()]=id

    id=letter+"N1"
    p=new Piece(letter,id,3,6,pieceY)
    //add to globals
    this.allPieces.push(id)
    this.idLookup[id]=p
    this.layout["6"+pieceY.toString()]=id

    //add bishops
    id=letter+"B0"
    p=new Piece(letter,id,2,2,pieceY)
    //add to globals
    this.allPieces.push(id)
    this.idLookup[id]=p
    this.layout["2"+pieceY.toString()]=id

    id=letter+"B1"
    p=new Piece(letter,id,2,5,pieceY)
    //add to globals
    this.allPieces.push(id)
    this.idLookup[id]=p
    this.layout["5"+pieceY.toString()]=id

    //add queen
    id=letter+"Q0"
    p=new Piece(letter,id,1,3,pieceY)
    //add to globals
    this.allPieces.push(id)
    this.idLookup[id]=p
    this.layout["3"+pieceY.toString()]=id

    //add king
    id=letter+"K0"
    p=new Piece(letter,id,0,4,pieceY)
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
  getPossibleMovesByPiece(id){
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
      //check if it can move along corners
      let protoPosX1=myPiece.posX+1
      let protoPosX2=myPiece.posX-1
      let protoPosY=myPiece.posY+1
      let adverseSide="B"
      direction=1
      if(myPiece.side=="B"){
        protoPosY=myPiece.posY-1
        adverseSide="A"
        direction=-1
      }
      //check each protoPos1
      if(this.occupiedBySide(protoPosX1,protoPosY,adverseSide)
      &&protoPosY<8&&protoPosY>=0&&protoPosX1<8&&protoPosX1>=0){
        possibleMoves.push([protoPosX1,protoPosY])
      }
      //check protoPos2
      if(this.occupiedBySide(protoPosX2,protoPosY,adverseSide)
      &&protoPosY<8&&protoPosY>=0&&protoPosX2<8&&protoPosX2>=0){
        possibleMoves.push([protoPosX2,protoPosY])
      }
      //check for enpassent
      if(myPiece.posY==3||myPiece.posX==4){
        //check for piece to the side
        var leftPawn = false
        var rightPawn = false
        if(myPiece.posX>0){
          if(this.occupiedBySide(myPiece.posX-1,myPiece.posY,adverseSide)){
            //check that the piece is a pawn 
            leftPawn= this.idLookup[this.layout[(myPiece.posX-1).toString()+(myPiece.posY).toString()]].enpassent
          }
        }
        if(myPiece.posX<7){
          if(this.occupiedBySide(myPiece.posX+1,myPiece.posY,adverseSide)){
            //check that the piece is a pawn 
            rightPawn= this.idLookup[this.layout[(myPiece.posX-1).toString()+(myPiece.posY).toString()]].enpassent
            //note that for non-pawns enpassent will be false
          }
        }
        if(rightPawn){
          possibleMoves.push([myPiece.posX+1,myPiece.posY+direction])
        }
        if(leftPawn){
          possibleMoves.push([myPiece.posX-1,myPiece.posY+direction])
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

      //castleing
      //castleing is represented by the king moveing to 6[yVal]
      if(!myPiece.hasMoved){
        //hard coding for each side
        var yVal="0"
        if(myPiece.side=="B"){//high Y value
          yVal="7"
        }
        if(this.layout["7"+yVal]!=""){
          //check that the rook is GTG
          let rook=this.idLookup[this.layout["7"+yVal]]
          if(rook.type==4&&!rook.moved){//if it has not moved it must be of the same side
            //check if the necissary squares are free
            if(this.layout["5"+yVal]==""&&this.layout["6"+yVal]==""){
              possibleMoves.push([6,yVal-0])
            }
          }
        }
      }
    }
    return possibleMoves
  }

  //returns all possible moves by side
  //side is char "A" or "B"
  //possible moves are in the form [[id,newpos(as string)],...]
  getPossibleMovesBySide(side){
    let output=[]
    let temp=[]
    //iterate over all pieces
    for(var i=0;i<this.allPieces.length;i++){
      id=this.allPieces[i]
      if(this.idLookup[id].side==side){
        temp=getPossibleMovesByPiece(id)
        for(var i=0;i<temp.length;i++){
          output.push([id,temp[i][0].toString()+temp[i][1].toString()])
        }
      }
    }
  }

  //takes a piece ID and a new position
  //returns true if move is legal
  //newPos is given as a two digit string
  checkMove(id,newPos){
    let posX=newPos[0]-0
    let posY=newPos[1]-0
    //it is fastest to just find all possible moves for the piece
    let possibleMoves=this.getPossibleMovesByPiece(id)
    for(let i=0;i<possibleMoves.length;i++){
      if(possibleMoves[i][0]==posX&&possibleMoves[i][1]==posY){
        return true//this will end function
      }
    }
    //if we get here without reutrning the move is not in the list
    return false
  }

  //takes a piece ID and a new position
  //returns true if move is legal
  //newPos is given as a two digit string
  //if legel the move is made
  makeMove(id,newPos){
    if(!this.checkMove(id,newPos)){
      return false//illegal move
    }
    // find old pos
    let oldPos=this.idLookup[id].posX.toString()//as string
    oldPos+=this.idLookup[id].posY.toString()

    //legal move
    //check if it is castleing
    if(this.idLookup[id].type==0){//if king
      let piece=this.idLookup[id]
      if(!piece.moved&&newPos[0]=="6"){//if the rook has moved checkMove would have cought it
        //castleing confirmed
        //move king to correct place
        this.layout[newPos]=id
        let king=this.idLookup[id]
        king.posX=newPos[0]-0
        king.posY=newPos[1]-0
        king.hasMoved=true

        //move rook

        let rook=this.idLookup[this.layout["7"+newPos[1]]]
        this.layout["5"+newPos[1]]=rook.id
        rook.posX=5
        rook.posY=newPos[1]-0
        rook.hasMoved=true

        //empy where the king and rook were
        this.layout[oldPos]=""
        this.layout["7"+oldPos[1]]=""

        return true//returning here
      }
    }
    //this will only run if not castleing
    //check if destination is occupied by the enemy
    if(this.layout[newPos]!=""){
      if(this.idLookup[this.layout[newPos]].side!=this.idLookup[id].side){
        //taking enemy
        //make enemy dead
        this.idLookup[this.layout[newPos]].dead=true
      }
    }

    //check if pawn is ready for enpassent
    if(this.idLookup[id].type==5){
      if(newPos[0]!=oldPos[0]){
        if(this.layout[newPos]==""){
          //an enpassent has been made
          if(newPos[1]=="5"){
            this.layout[newPos[0]+"4"]=""
          }
          if(newPos[1]=="2"){
            this.layout[newPos[0]+"3"]=""
          }
        }
      }
    }
    //empy old pos
    this.layout[oldPos]=""//empty
    //set newPos to id
    this.layout[newPos]=id
    //set object position
    this.idLookup[id].posX=newPos[0]-0
    this.idLookup[id].posY=newPos[1]-0
    

    //check if pawn is at the end
    if(this.idLookup[id].type==5){
      if(this.idLookup[id].hasMoved==false){
        if(this.idLookup[id].side=="A"&&newPos[1]==3){
          this.idLookup[id].enpassent=true
        }
        if(this.idLookup[id].side=="B"&&newPos[1]==4){
          this.idLookup[id].enpassent=true
        }
      }
      if(this.idLookup[id].side=="A"){
        if(newPos[1]==7){
          //convert pawn to queen
          this.idLookup[id].type=1
        }
      }
      if(this.idLookup[id].side=="B"){
        if(newPos[1]==0){
          //convert pawn to queen
          this.idLookup[id].type=1
        }
      }                                 
    }
    this.idLookup[id].hasMoved=true

    return true
  }

  //returns a full deep copy of this
  copy(){
    let newB=Board()
    //copy layout
    for(var i=0;i<7;i++){
      for(var j=0;j<7;j++){
        newB.layout[i.toString()+b.toString()]=this.layout[i.toString()+b.toString()]
      }
    }
    //for every piece object create a deep copy
    let id=""
    for(var i=0;i<newB.allPieces.length;i++){
      id=newB.allPieces[i]
      newB.idLookup[id]=this.idLookup[id].copy()
    }
    return newB
  }

  //returns true if side is in check
  inCheck(side){
    //find king
    for(var i=0;i<this.allPieces.length;i++){
      if(this.idLookup[this.allPieces[i]].side==side){
        if(this.idLookup[this.allPieces[i]].type==0){
          //found him
          let king=this.allPieces[i]
          break
        }
      }
    }
    //get the king's hiding location
    let kingPos=""
    kingPos+=king.posX
    kingPos+=king.posY

    //
    var enemy="B"
    if(side=="B"){
      enemy=="A"
    }
    let temp=this.getPossibleMovesBySide(enemy)
    for(var i=0;i<temp.length;i++){
      if(temp[i][1]==kingPos){
        return true
        //this is if a valid enemy move can take the king
      }
    }
    //if we get here there are no valid enemy moves that can take the king
    return false
  }

  //returns true if side is in checkmate
  inCheckMate(side){
    if(!this.inCheck(side)){//checking already in check
      return false
    }
    //we now have to check every possible move for side
    let options=this.getPossibleMovesBySide(side)
    let newBoard=Board()
    for(var i=0;i<options.length;i++){
      //for every option
      //make a copy of the board
      newBoard=this.copy()
      //make the move
      newBoard.makeMove(options[i][0],options[i][1])
      //check check
      if(!newBoard.isCheck(side)){
        return false
      }
    }
    //if we get here then unfrounatly it is checkmate
    return true
  }
}

module.exports = Board
