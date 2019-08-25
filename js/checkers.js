class Checkers{
	
	constructor(defaultBoard = true, listOfSquares = null, squares = document.getElementsByClassName("black-square"),computerPlayer = true){
		this.squares = squares;
		this.selectOn = false;
		this.blackTurn = true;
		this.listOfSquares = new Array(32);
		this.activeSquare = 100;
		this.computerPlayer = computerPlayer;

		if(defaultBoard){
			for (var i = 0; i < 32; i++){
				if(i < 12){
					drawPiece(this.squares[i],-1);
					this.listOfSquares[i] = new Square(i,-1);
				}
				else if(i > 19){
					drawPiece(this.squares[i],1);
					this.listOfSquares[i] = new Square(i,1);
				}
				else{
					this.listOfSquares[i] = new Square(i,0);
				}
			}
		}
		else{
			this.listOfSquares = listOfSquares.slice(0);
			for (var i = 0; i < 32; i++){
				drawPiece(this.squares[i],listOfSquares[i].isOccupied());
			}
		}
	}

	simulateGame(numGames = 1){
		while(this.blackScore() > 0 && this.redScore() > 0){
			var blackAI = new randomAI(this);
			//var blackAI = new AlphabetaAI(3,'score',1);
			var redAI = new AlphabetaAI(5,'score',-1);
			//var blackmove = blackAI.playTurn(ch.blackTurn,ch.listOfSquares,0);
			var blackmove = blackAI.playTurn();
			setTimeout(function(ch){
				try{
					ch.move(blackmove[0],blackmove[1],ch.listOfSquares[blackmove[0]].isOccupied());
				}
				catch(err){

				}
				ch.blackTurn = !ch.blackTurn;
			}(this),1)
			var redmove = redAI.playTurn(ch.blackTurn,ch.listOfSquares,0);
			setTimeout(function(ch){
				try{
					ch.move(redmove[0],redmove[1],ch.listOfSquares[redmove[0]].isOccupied());
				}
				catch(err){

				}
				ch.blackTurn = !ch.blackTurn;
			}(this),1)
			if(this.blackScore() == 0){
				return 1;
			}
		}
		return 0;
	}

	updateBoard(){
		for (var i = 0; i < 32; i++){
			this.squares[i].addEventListener("click", function(ch,n){
				return function(){
					if(ch.selectOn){
						for(var j = 0; j < 32; j++){
							ch.squares[j].style.backgroundColor = '#654321';
						}
						ch.updateSelect(false);
						if(ch.checkMove(ch.activeSquare,ch.listOfSquares[ch.activeSquare].isOccupied(),n)){
							ch.move(ch.activeSquare,n,ch.listOfSquares[ch.activeSquare].isOccupied())
							ch.blackTurn = !ch.blackTurn;
							if(ch.computerPlayer){
								var ai = new AlphabetaAI(5,'score',-1);
								var redmove = ai.playTurn(ch.blackTurn,ch.listOfSquares,0,true);
								setTimeout(function(){
									ch.move(redmove[1][0],redmove[1][1],ch.listOfSquares[redmove[1][0]].isOccupied());
									ch.blackTurn = !ch.blackTurn;
								},1000)
							}
						}
						ch.activeSquare = 100;
					}
					else{
						if(!ch.computerPlayer){
							if ((ch.listOfSquares[n].isOccupied() > 0 && ch.blackTurn) ||(ch.listOfSquares[n].isOccupied() < 0 && !ch.blackTurn)){
								this.style.backgroundColor = 'blue';
								ch.updateSelect(true);
								ch.activeSquare = n;
							}
						}
						else{
							if (ch.listOfSquares[n].isOccupied() > 0 && ch.blackTurn){
								this.style.backgroundColor = 'blue';
								ch.updateSelect(true);
								ch.activeSquare = n;
							}
						}				

					}
				}
			}(this,i),false);
		}
	}

	updateSelect(s){
		this.selectOn = s;
	}	

	setPlayer(computerPlayer){
		this.computerPlayer = computerPlayer;
	}

	checkMove(loc,piece,destination){
		if(loc < 0 || loc > 31 || destination < 0 || destination > 31){
			return false;
		}
		else if(this.listOfSquares[destination].isOccupied() != 0){
			return false;
		}
		/*else if(Math.abs(loc-destination) > 9){
			return this.multiJump(loc,piece,destination)[0];
		}*/
		else{
			if (Math.abs(piece) < 5){
				if(piece == 1){
					if(loc % 8 > 3){
						if(loc % 8 == 7){
							if((loc - destination) == 4){
								return true;
							}
							else if(((loc - destination) == 9) && this.listOfSquares[loc-4].isOccupied() < 0){
								return true;
							}
						}
						else{
							if((loc - destination) == 3 || (loc - destination) == 4){
								return true;
							}
							else if(((loc - destination) == 9) && this.listOfSquares[loc-4].isOccupied() < 0 && (loc % 8 != 4)){
								return true;
							}
							else if(((loc - destination) == 7) && this.listOfSquares[loc-3].isOccupied() < 0){
								return true;
							}
						}
					}
					else{
						if(loc % 8 == 0){
							if((loc - destination) == 4){
								return true;
							}
							else if(((loc - destination) == 7) && this.listOfSquares[loc-4].isOccupied() < 0){
								return true;
							}
						}
						else{
							if((loc - destination) == 4 || (loc - destination) == 5){
								return true;
							}
							else if(((loc - destination) == 9) && this.listOfSquares[loc-5].isOccupied() < 0){
								return true;
							}
							else if(((loc - destination) == 7) && this.listOfSquares[loc-4].isOccupied() < 0 && (loc % 8 != 3)){
								return true;
							}
						}
					}
				}
				else if(piece == -1){
					if(loc % 8 < 4){
						if(loc % 8 == 0){
							if((loc - destination) == -4){
								return true;
							}
							else if(((loc - destination) == -9) && this.listOfSquares[loc+4].isOccupied() > 0){
								return true;
							}
						}
						else{
							if((loc - destination) == -3 || (loc - destination) == -4){
								return true;
							}
							else if(((loc - destination) == -9) && this.listOfSquares[loc+4].isOccupied() > 0 && (loc % 8 != 3)){
								return true;
							}
							else if(((loc - destination) == -7) && this.listOfSquares[loc+3].isOccupied() > 0){
								return true;
							}
						}

					}
					else{
						if(loc % 8 == 7){
							if((loc - destination) == -4){
								return true;
							}
							else if(((loc - destination) == -7) && this.listOfSquares[loc+4].isOccupied() > 0){
								return true;
							}
						}
						else{
							if((loc - destination) == -4 || (loc - destination) == -5){
								return true;
							}
							else if(((loc - destination) == -9) && this.listOfSquares[loc+5].isOccupied() > 0){
								return true;
							}
							else if(((loc - destination) == -7) && this.listOfSquares[loc+4].isOccupied() > 0 && (loc % 8 != 4)){
								return true;
							}
						}
					}
				}
			}
			else if(piece == 5){
				if(this.checkMove(loc,1,destination)){
					return true;
				}
				else if(this.checkMove(loc,-1,destination) && Math.abs(loc-destination) < 6){
					return true;
				}
				else if(loc % 8 < 4){
					if(loc % 8 == 0){
						if(((loc - destination) == -9) && this.listOfSquares[loc+4].isOccupied() < 0){
							return true;
						}
					}
					else{
						if(((loc - destination) == -9) && this.listOfSquares[loc+4].isOccupied() < 0 && (loc % 8 != 3)){
							return true;
						}
						else if(((loc - destination) == -7) && this.listOfSquares[loc+3].isOccupied() < 0){
							return true;
						}
					}
				}
				else{
					if(loc % 8 == 7){
						if(((loc - destination) == -7) && this.listOfSquares[loc+4].isOccupied() < 0){
							return true;
						}
					}
					else{
						if(((loc - destination) == -9) && this.listOfSquares[loc+5].isOccupied() < 0){
							return true;
						}
						else if(((loc - destination) == -7) && this.listOfSquares[loc+4].isOccupied() < 0 && (loc % 8 != 4)){
							return true;
						}
					}
				}
			}
			else if(piece == -5){
				if(this.checkMove(loc,-1,destination)){
					return true;
				}
				else if(this.checkMove(loc,1,destination) && Math.abs(loc-destination) < 6){
					return true;
				}
				else if(loc % 8 > 3){
					if(loc % 8 == 7){
						if(((loc - destination) == 9) && this.listOfSquares[loc-4].isOccupied() > 0){
							return true;
						}
					}
					else{
						if(((loc - destination) == 9) && this.listOfSquares[loc-4].isOccupied() > 0 && (loc % 8 != 4)){
							return true;
						}
						else if(((loc - destination) == 7) && this.listOfSquares[loc-3].isOccupied() > 0){
							return true;
						}
					}
				}
				else{
					if(loc % 8 == 0){
						if(((loc - destination) == 7) && this.listOfSquares[loc-4].isOccupied() > 0){
							return true;
						}
					}
					else{
						if(((loc - destination) == 9) && this.listOfSquares[loc-5].isOccupied() > 0){
							return true;
						}
						else if(((loc - destination) == 7) && this.listOfSquares[loc-4].isOccupied() > 0 && (loc % 8 != 3)){
							return true;
						}
					}
				}
			}
			else{
				return false;
			}
		}
	
	}

	multiJump(loc,piece,destination,seq = []){
		console.log(loc,destination);
		if(Math.abs(loc - destination) == 7 || Math.abs(loc - destination) == 9){
			var new_seq = seq.slice(0);
			new_seq.push(destination-loc);
			return [this.checkMove(loc,piece,destination),new_seq];
		}
		else{
			if(this.checkMove(loc,piece,loc + 7) == true){
				var new_seq = seq.slice(0);
				new_seq.push(7)
				return this.multiJump(loc+7,piece,destination,new_seq);
			}
			if(this.checkMove(loc,piece,loc + 9) == true){
				var new_seq = seq.slice(0);
				new_seq.push(9)
				return this.multiJump(loc+9,piece,destination,new_seq);
			}
			if(this.checkMove(loc,piece,loc - 7) == true){
				var new_seq = seq.slice(0);
				new_seq.push(-7)
				return this.multiJump(loc-7,piece,destination,new_seq);
			}
			if(this.checkMove(loc,piece,loc - 9) == true){
				var new_seq = seq.slice(0);
				new_seq.push(-9)
				return this.multiJump(loc-9,piece,destination,new_seq);
			}
			return[false,seq];
		} 
		return [false,seq];
	}

	move(loc,destination,piece){
		if(Math.abs(destination-loc) > 5){
			if(Math.abs(loc - destination) == 7 && loc % 8 > 3){
				if(Math.sign(loc-destination) > 0){
					this.listOfSquares[loc-3] = new Square(loc-3,0);
					drawPiece(this.squares[loc-3],0);
				}
				else{
					this.listOfSquares[loc+4] = new Square(loc+4,0);
					drawPiece(this.squares[loc+4],0);
				}
			}
			else if(Math.abs(loc - destination) == 9  && loc % 8 > 3){
				if(Math.sign(loc-destination) > 0){
					this.listOfSquares[loc-4] = new Square(loc-4,0);
					drawPiece(this.squares[loc-4],0);
				}
				else{
					this.listOfSquares[loc+5] = new Square(loc+5,0);
					drawPiece(this.squares[loc+5],0);
				}
			}
			else if(Math.abs(loc - destination) == 7){
				if(Math.sign(loc-destination) > 0){
					this.listOfSquares[loc-4] = new Square(loc-4,0);
					drawPiece(this.squares[loc-4],0);
				}
				else{
					this.listOfSquares[loc+3] = new Square(loc+3,0);
					drawPiece(this.squares[loc+3],0);
				}
			}
			else if(Math.abs(loc - destination) == 9){
				if(Math.sign(loc-destination) > 0){
					this.listOfSquares[loc-5] = new Square(loc-5,0);
					drawPiece(this.squares[loc-5],0);
				}
				else{
					this.listOfSquares[loc+4] = new Square(loc+4,0);
					drawPiece(this.squares[loc+4],0);
				}
			}
			else if(Math.abs(loc - destination) > 9){
				var sequence = this.multiJump(loc,piece,destination)[1];
				var new_loc = loc;
				for(var i = 0; i < sequence.length+1; i++){
					this.move(new_loc,new_loc+sequence[i],piece);
					new_loc = new_loc+sequence[i];
				}
			}
		}
		if ((destination < 4 && piece == 1)||(destination > 27 && piece == -1)) {
			this.listOfSquares[loc] = new Square(loc,0);
			this.listOfSquares[destination] = new Square(destination,5*piece);
			drawPiece(this.squares[loc],0);
			drawPiece(this.squares[destination],5*piece);
		}
		else{
			this.listOfSquares[loc] = new Square(loc,0);
			this.listOfSquares[destination] = new Square(destination,piece);
			drawPiece(this.squares[loc],0);
			drawPiece(this.squares[destination],piece);
		}
	}

	blackScore(){
		var score = 0;
		for (var i = 0; i < 32; i++){
			if (this.listOfSquares[i].isOccupied() > 0){
				if(this.listOfSquares[i].isOccupied()== 5){
					score += 2;
				}
				else{
					score += 1;
				}

			}
		}
		return score;
	}

	redScore(){
		var score = 0;
		for (var i = 0; i < 32; i++){
			if (this.listOfSquares[i].isOccupied() < 0){
				if(this.listOfSquares[i].isOccupied()== -5){
					score += 2;
				}
				else{
					score += 1;
				}
			}
		}
		return score;
	}

	calculateMoves(){
		var mov = [3,-3,4,-4,5,-5,7,-7,9,-9];
		var moves = [];
		if(this.blackTurn){
			for(var i = 0; i < 32; i++){
				if(this.listOfSquares[i].isOccupied() > 0){
					for(var j = 0; j < mov.length; j++){
						if(this.checkMove(i,this.listOfSquares[i].isOccupied(),i+mov[j])){
							moves.push([i,i+mov[j]]);
						}
					}
				}
			}
		}
		else{
			for(var i = 0; i < 32; i++){
				if(this.listOfSquares[i].isOccupied() < 0){
					for(var j = 0; j < mov.length; j++){
						if(this.checkMove(i,this.listOfSquares[i].isOccupied(),i+mov[j])){
							moves.push([i,i+mov[j]]);
						}
					}
				}
			}
		}
		return moves;
	}

	numberNeighbors(color){
		var neighbors = 0;
		for(var i = 0; i < 32; i++){
			if(color == 1){
				if(this.listOfSquares[i].isOccupied() > 0){
					if(i % 8 < 4){
						if(i -4 > -1 && this.listOfSquares[i-4].isOccupied() > 0){
							neighbors += 1;
						} 
						if(i % 8 != 0){
							if(i-5 > -1 && this.listOfSquares[i-5].isOccupied() > 0){
								neighbors += 1;
							} 
						}
					}
					else{
						if(i-4 > -1 && this.listOfSquares[i-4].isOccupied() > 0){
							neighbors += 1;
						} 
						if(i % 8 != 7){
							if(i-4 > -1 && this.listOfSquares[i-3].isOccupied() > 0){
								neighbors += 1;
							} 
						}
					}
				}
			}
			else{
				if(this.listOfSquares[i].isOccupied() < 0){
					if(i % 8 < 4){
						if(i+4 < 32 && this.listOfSquares[i+4].isOccupied() < 0){
							neighbors += 1;
						} 
						if(i % 8 != 0){
							if(i+3 < 32 && this.listOfSquares[i+3].isOccupied() < 0){
								neighbors += 1;
							} 
						}
					}
					else{
						if(i+4 < 32 && this.listOfSquares[i+4].isOccupied() < 0){
							neighbors += 2;
						} 
						if(i % 8 != 7){
							if(i+5 < 32 && this.listOfSquares[i+5].isOccupied() < 0){
								neighbors += 2;
							} 
						}
					}
				}
			}
		}
		return neighbors;
	}

	kingsInBackRow(color){
		var kings = 0;
		if(color == 1){
			for(var i = 0; i < 4; i++){
				if(this.listOfSquares[i].isOccupied() > 0){
					kings += 1;
				}
			}
		}
		else{
			for(var i = 28; i < 32; i++){
				if(this.listOfSquares[i].isOccupied() < 0){
					kings += 1;
				}
			}
		}
	}

	clearBoard(){
		for (var i = 0; i < 32; i++){
			drawPiece(this.squares[i],0);
		}
		this.listOfSquares = null;
	}
}

function drawPiece(element,piece){
	if(element == null){}
	else{
		if(piece == 0){
			element.innerHTML = '';
		}
		else if(piece == 1){
			element.innerHTML = '<img src="img/black_piece.png">';
		}
		else if(piece == -1){
			element.innerHTML = '<img src="img/red_piece.png">';
		}
		else if(piece == 5){
			element.innerHTML = '<img src="img/black_king.png">';
		}
		else if(piece == -5){
			element.innerHTML = '<img src="img/red_king.png">';
		}
	}
}

class Square{
	constructor(loc,piece){
		this.loc = loc;
		this.piece = piece;
	}

	isOccupied(){
		return this.piece;
	}
}

class AlphabetaAI{
	constructor(cutoff,e,color){
		this.cutoff = cutoff;
		this.eval = e;
		this.col = color;
	}

	playTurn(blackTurn,currentBoard,depth,fullOutput = false){
		if(fullOutput){
			return this.alphabetaMinimax(blackTurn,currentBoard,depth);
		}
		else{
			return this.alphabetaMinimax(blackTurn,currentBoard,depth)[1];
		}
	}

	scoreEval(game,depth){
		if(this.col == -1){
			if(game.blackScore() == 0){
				return [1000-depth,null];
			}
			else if(game.calculateMoves() == 0){
				return [-1000+depth,null];
			}
			else if(game.redScore() == 0){
				return [-1000+depth,null];
			}
			return [(game.redScore() - game.blackScore()),null];
		}
		else{
			if(game.redScore() == 0){
				return [1000-depth,null];
			}
			else if(game.calculateMoves() == 0){
				return [-1000+depth,null];
			}
			else if(game.blackScore() == 0){
				return [-1000+depth,null];
			}
			return [(game.blackScore() - game.redScore()),null];
		}

	}

	spaceEval(game){
		if(this.col == -1){
			if(game.blackScore() == 0){
				return [1000,null];
			}
			else if(game.calculateMoves() == 0){
				return [-1000,null];
			}
			else if(game.redScore() == 0){
				return [-1000,null];
			}
			return [(game.redScore() - game.blackScore() - game.numberNeighbors(-1)),null];
		}
		else{
			if(game.redScore() == 0){
				return [1000,null];
			}
			else if(game.calculateMoves() == 0){
				return [-1000,null];
			}
			else if(game.blackScore() == 0){
				return [-1000,null];
			}
			return [(game.blackScore() - game.redScore() - game.numberNeighbors(1)),null];
		}
	}

	alphabetaMinimax(blackTurn,currentBoard,depth,a = -1*Infinity,b = Infinity){
		var squares = new Array(32);
		var game = new Checkers(false,currentBoard,squares);
		game.blackTurn = blackTurn;
		if(this.cutoff == depth||game.redScore() == 0||game.blackScore() == 0||game.calculateMoves().length == 0){
			if(this.eval == 'score'){
				return this.scoreEval(game,depth);
			}
			else if(this.eval == 'space'){
				return this.spaceEval(game);
			}
		}
		else{
			var val = -1000;
			var best_act = null;
			var actions = game.calculateMoves();
			for(var i = 0; i < actions.length; i++){
				var newgame = new Checkers(false,game.listOfSquares,squares);
				newgame.move(actions[i][0],actions[i][1],newgame.listOfSquares[actions[i][0]].isOccupied());
				var newBoard = newgame.listOfSquares;
				var new_val = this.alphabetaMaximin(!blackTurn,newBoard,depth+1,a,b)[0];
				if(new_val > val){
					val = new_val;
					best_act = actions[i];
				}
				if(val >= b){
					return [val,best_act];
				}
				a = Math.max(a,val);
			}
		}
		if(best_act == null){
			best_act = actions[0];
		}
		return [val,best_act];
	}

	alphabetaMaximin(blackTurn,currentBoard,depth,a = -1*Infinity, b = Infinity){
		var squares = new Array(32);
		var game = new Checkers(false,currentBoard,squares);
		game.blackTurn = blackTurn;
		if(this.cutoff == depth||game.calculateMoves().length == 0||game.blackScore() == 0||game.redScore() == 0){
			if(this.eval == 'score'){
				return this.scoreEval(game,depth);
			}
			else if(this.eval == 'space'){
				return this.spaceEval(game);
			}
		}
		else{
			var val = 1000;
			var best_act = null;
			var actions = game.calculateMoves();
			for(var i = 0; i < actions.length; i++){
				var newgame = new Checkers(false,game.listOfSquares,squares);
				newgame.move(actions[i][0],actions[i][1],game.listOfSquares[actions[i][0]].isOccupied());
				var newBoard = newgame.listOfSquares;
				var new_val = this.alphabetaMinimax(!blackTurn,newBoard,depth+1,a,b)[0];
				if(new_val < val){
					val = new_val;
					best_act = actions[i];
				}
				if(val <= a){
					return [val,best_act];
				}
				b = Math.min(b,val);
			}
		}
		if(best_act == null){
			best_act = actions[0];
		}
		return [val,best_act];
	}
}

class randomAI{
	constructor(game){
		this.game = game;
	}

	playTurn(){
		var actions = this.game.calculateMoves();
		var best_act = actions[Math.floor(actions.length*Math.random())]
		return best_act;
	}
}




var listsquares = new Array(32);
for (var i = 0; i < 32; i++){
	listsquares[i] = new Square(i,0);
}
listsquares[3] = new Square(3,-1);
listsquares[7] = new Square(7,-1);
listsquares[10] = new Square(10,-1);
listsquares[8] = new Square(8,-1);
listsquares[14] = new Square(14,-1);
listsquares[21] = new Square(21,-1);
listsquares[22] = new Square(22,-1);
listsquares[23] = new Square(23,1);
listsquares[26] = new Square(26,-5);
listsquares[29] = new Square(29,-5);


document.getElementsByClassName("container")[0].style.width = window.innerHeight.toString() + "px";
var ch = new Checkers(true,null,document.getElementsByClassName("black-square"),true);
ch.updateBoard();
//console.log(ch.simulateGame(1));
