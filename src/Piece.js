//One class for all chess peices
//this mostly acts as a container for information
class Peice{
  //side is a char either "A" or "B"
  //NOTE A starts at a low Y vale and B starts at a high Y value
  //id is a string
  //type is an int indicating the movement rules and point value of a peice
  /*
  0 King
  1 Queen
  2 Bishop
  3 Knight
  4 Rook
  5 Pawn
  */
  constructor(side,id,type,posX,posY){
    if (side!="A"&&side!="B"){
      throw("Side not A or B")
    }
    this.side=side
    this.id=id
    this.type=type
    this.posX=posX
    this.posY=posY
    this.hasMoved=false//used for pawns and knings
  }
}

module.exports = Peice