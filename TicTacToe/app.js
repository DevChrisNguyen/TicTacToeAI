
const PLAYER_TOKEN = 'X'    //Used to display letter when the player makes move
const COMPUTER_TOKEN = 'O'  //Used to display letter when the player makes move

//A page can't be manipulated safely until the document is "ready." jQuery detects this state of readiness for you.
// Code included inside $( document ).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute. 
// Code included inside $( window ).on( "load", function() { ... }) will run once the entire page (images or iframes), not just the DOM, is ready.
$(document).ready(function () {
    let gameHardness = 4;
    // There are a finite number of turns in tic tac toe. This variable will keep track of the game's progress.
    let turns = 0; 
    const gameGrid = [
        [' ', ' ', ' '],
        [' ', ' ', ' '],
        [' ', ' ', ' ']
    ];
    //10.08.20 
    var lastGameResult = document.getElementById("lastResult");
    var displayHardness = document.getElementById("displayHardness");
 
    var rangeslider = document.getElementById("sliderRange"); 
    rangeslider.value = gameHardness; 
  
    rangeslider.oninput = function() { 
      gameHardness = this.value; 
      displayHardness.innerHTML = gameHardness; 
      //rangeoutput.innerHTML(this.value);

    }
    
    
    // isGameOver: Determines if any player has won.
    function isGameOver(newGrid) {
        // checking for horizontal wins
        for (var i = 0; i < 3; i++) {
            if (newGrid[i][0] !== ' ' &&
                newGrid[i][0] === newGrid[i][1] &&
                newGrid[i][1] === newGrid[i][2]) {
                // return winning letter
                return newGrid[i][0]
            }
        }
        // checking for vertical wins
        for (var j = 0; j < 3; j++) {
            if (newGrid[0][j] !== ' ' &&
                newGrid[0][j] === newGrid[1][j] &&
                newGrid[1][j] === newGrid[2][j]) {
                return newGrid[0][j]
            }
        }
        // check for diagonal win /
        if (newGrid[2][0] !== ' ' &&
            newGrid[2][0] === newGrid[1][1] &&
            newGrid[2][0] === newGrid[0][2]) {
            return newGrid[2][0]
        }
        // check for diagonal win \
        if (newGrid[0][0] !== ' ' &&
            newGrid[0][0] === newGrid[1][1] &&
            newGrid[0][0] === newGrid[2][2]) {
            return newGrid[0][0]
        }
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (newGrid[i][j] === ' ')
                    return false;
            }
        }
        // game board is full and no winner was found. Game ends in stalemate
        if (turns >= 9)return "draw";
        // no winner so return null to show game is not finished.
        return null;
    }
    // minmax:  Determines the best move for the AI player to make by using the MinMax Algorithm.
    // Returned will be the location of the move (i,j).
    function minmax(newGrid, depth, player) {
        
        // First we check if the game continues
        const gameState = isGameOver(newGrid);
       
        if (gameState === false) {
            // values array will hold the "end nodes" for the MinMax Algorithm.
            // the AI's move will be chosen based on data in values array.
            const values = [];
            // double for loop is used to traverse the game board
            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    // a copy of the game grid is used so the algorithm can "look ahead" at possible moves without
                    // changing the original game board.
                    const gridCopy = _.cloneDeep(newGrid);
                    // if the move's location is not available, go to the next space
                    if (gridCopy[i][j] !== ' ') {
                        continue;
                    }
                    if (depth > gameHardness) {
                        if(player === PLAYER_TOKEN) {
                            return depth - 10;
                        } else if (player === COMPUTER_TOKEN) {
                            return 10 - depth;
                        }
                    }
                    // move is made on game board clone.
                    gridCopy[i][j] = player;
                    // after move is made, minmax is called again "RECURSION" to re-examine the game board.
                    // Recursion will continue until "end node" of recursion tree is reached.

                    const val = minmax(gridCopy, depth + 1, (player === PLAYER_TOKEN) ? COMPUTER_TOKEN : PLAYER_TOKEN);
                    // the value returned from minmax along with the move's location is pushed to the values array
                    values.push({
                        cell: {
                            i: i,
                            j: j
                        } // a high value for cost means it is a good move for the AI to make, a low value is a bad move to make.
                        , cost: val
                    });
                }
            }
            if (player === COMPUTER_TOKEN) {
                // AI's turn so best move for AI is chosen
                const max = _.maxBy(values, (v) => {
                    return v.cost;
                });
                if (depth === 0) {
                    return max.cell;
                } else {
                    return max.cost;
                }
            } else {
                // Human player's turn so AI will asume human will make move to keep AI from winning
                // so the lowest value move is chosen.
                const min = _.minBy(values, (v) => {
                    return v.cost;
                });
                if (depth === 0) {
                    return min.cell;
                } else {
                    return min.cost;
                }
            }
        } else if (gameState === null) {
            return 0;
        } else if (gameState === PLAYER_TOKEN) {
            return depth - 10;
        } else if (gameState === COMPUTER_TOKEN) {
            return 10 - depth;
        }
    }
    function AIMove() {
       return minmax(gameGrid, 0, COMPUTER_TOKEN);
    }
    function messageBox(message){
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "progressBar": true,
            "preventDuplicates": false,
            "positionClass": "toast-top-center",
            "showDuration": "400",
            "hideDuration": "1000",
            "timeOut": "7000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
        if(message === PLAYER_TOKEN){        
            toastr.success("WOW! You WIN!");
            lastGameResult.innerHTML = "PlayerWin";

            //
        }
        if(message === COMPUTER_TOKEN){
            toastr.error("You Lose! Try again.");
            lastGameResult.innerHTML = "PlayerLost";

            //Make the opponet's letters fade yo; 
        }
        if(message==="draw"){
            toastr.info("Draw. Try again.");
            lastGameResult.innerHTML = "draw";

        }
    }
    // this function contains logic for the human player's move
    $('.col').click(function () {
        // check if game is over
        let gameState = isGameOver(gameGrid);
        if(gameState) return;
        // gets location (i,j) of player's click/move
        $this = $(this);
        const i = $this.data('i');
        const j = $this.data('j');
        // Human's move must be valid...
        if(gameGrid[i][j] === ' '){
        $this.html(PLAYER_TOKEN);
        gameGrid[i][j] = PLAYER_TOKEN;
        turns++;
        }
        // ... or else the move is ignored
        else{
            return; 
        }
        // Checking game state after Human's turn.
        gameState = isGameOver(gameGrid);
        if (gameState) {
            messageBox(gameState);
            return;
        }
        else {
            // AI makes a move here.
            const move = AIMove();
            gameGrid[move.i][move.j] = COMPUTER_TOKEN;
            $('.col[data-i=' + move.i + '][data-j=' + move.j + ']').html(COMPUTER_TOKEN);
            turns++;
        } 
        // checking game state after AI has made a move.
        gameState = isGameOver(gameGrid);
        if (gameState) {
            messageBox(gameState);
        }
    });
    // function to reset the game board.
    $('#restart').click(function () {
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                gameGrid[i][j] = ' ';
                $('.col[data-i=' + i + '][data-j=' + j + ']').html(' ');
            }
        }
        gameOver = false;
        turns = 0;
    });


});