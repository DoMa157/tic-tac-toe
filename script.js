const startButton = document.querySelector(".start-button");
startButton.addEventListener("click", startGame);


function startGame(e){
    e.preventDefault();
    Game.initializeGame();
}

const Board = (function () {
    let board = [[".", ".", "."], [".", ".", "."], [".", ".", "."]];

    const getCell = function (i, j) {
        return board[i][j];
    };
    const setCell = function (i, j, value) {
        board[i][j] = value;
    };

    const resetBoard = function(){
        board = [[".", ".", "."], [".", ".", "."], [".", ".", "."]];
    }

    const isFull = function(){
        for(let i = 0; i < board.length; i++){
            for(let j = 0; j<board.length; j++){
                if(board[i][j] == "."){
                    return false;
                }
            }
        }
        return true;
    }
    return {setCell, getCell, resetBoard, isFull};
})();

function createPlayer(name, marker) {
    let score = 0;
    const incrementScore = () => score++;
    return { incrementScore,name,score, marker };
}

const Game = (function () {
    let players = [createPlayer("Player 1", "X"), createPlayer("Player 2", "X")];

    const initializeGame = function() {
        Board.resetBoard();
        let firstName = DisplayManager.getFirstName();
        let secondName = DisplayManager.getSecondName();
        players = [createPlayer(firstName, "X"), createPlayer(secondName, "O")];
        DisplayManager.generateCells();
    }
    let activePlayerIndex = 0;
    let activePlayer = players[activePlayerIndex];
    const play = function (i, j) {
        let marker = activePlayer.marker;
        if (Board.getCell(i, j) != "." || i < 0 || i > 3 || j < 0 || j > 3) return;
        Board.setCell(i, j, marker);
        DisplayManager.generateCells();
        if(checkWinner()){
            DisplayManager.showWinner(activePlayer);
            activePlayer.incrementScore();
            return;
        }
        if(Board.isFull()){
            DisplayManager.showTie();
            return;
        }
        activePlayerIndex = (activePlayerIndex + 1) % players.length;
        activePlayer = players[activePlayerIndex];
    };
    const checkWinner = function () {
        for (let i = 0; i < 3; i++) {
            let counter = 0;
            let currVal = Board.getCell(0, i);
            for (let j = 0; j < 3; j++) {
                let tempVal = Board.getCell(j, i);
                if (tempVal == currVal) {
                    counter++;
                }
            }
            if (counter == 3 && currVal !== ".") {
                return true;
            }
            counter = 0;
            currVal = Board.getCell(i, 0);
            for (let j = 0; j < 3; j++) {
                let tempVal = Board.getCell(i, j);
                if (tempVal == currVal) {
                    counter++;
                }
            }
            if (counter == 3 && currVal !== ".") {
                return true;
            }
        }
        if (Board.getCell(0, 0) == Board.getCell(1, 1) && Board.getCell(1,1) == Board.getCell(2, 2) && Board.getCell(0, 0) != ".") {
            return true;
        }
        if (Board.getCell(0, 2) == Board.getCell(1, 1) && Board.getCell(1,1) == Board.getCell(2, 0) && Board.getCell(0, 2) != ".") {
            return true;
        }
        return false;
    }
    return {play, checkWinner, initializeGame, players};
})();


const DisplayManager = (function (Game){
    const parentGridHTML = document.querySelector("body>div").innerHTML;
    const generateCells = function (){
        const parentGrid = document.querySelector("body>div");
        const grid = document.createElement("div");
        grid.className = "grid";
        const score = document.querySelector(".score");
        parentGrid.innerHTML = parentGridHTML;
        grid.innerHTML = "";
        for(let i = 0; i < 5; i++){
            for(let j = 0; j < 5; j++){
                if(i == 1 || j == 1 || i == 3 || j == 3){
                    let border = document.createElement("div");
                    border.className = "border";
                    grid.appendChild(border);
                }
                else{
                    let cell = document.createElement("div");
                    cell.className = "cell";
                    let adjustedIndices = [];
                    if(i == 0) adjustedIndices[0] = 0;
                    if(i == 2) adjustedIndices[0] = 1;
                    if(i == 4) adjustedIndices[0] = 2;
                    if(j == 0) adjustedIndices[1] = 0;
                    if(j == 2) adjustedIndices[1] = 1;
                    if(j == 4) adjustedIndices[1] = 2;
                    cell.textContent = Board.getCell(adjustedIndices[0], adjustedIndices[1]);
                    cell.addEventListener("click", () => Game.play(adjustedIndices[0],adjustedIndices[1]));
                    grid.appendChild(cell);
                }
            }
        }
        parentGrid.appendChild(grid);
        score.textContent = "";
    };

    const showWinner = function(player){
        const score = document.querySelector(".score");
        score.textContent = `${player.name} wins !`;
    }

    const showTie = function(){
        const score = document.querySelector(".score");
        score.textContent = "TIE ! Press start game to rematch."
    }

    const getFirstName = function(){
        const firstFormName = document.querySelector('input[name = "player-one"]').value;
        return firstFormName;
    }

    const getSecondName = function(){
        const secondFormName = document.querySelector('input[name = "player-two"').value;
        return secondFormName;
    }

    const initialText = function(){
        const press = document.querySelector(".score");
        press.textContent = "Type in names and press start button to start";
    }
    return {generateCells, showWinner, getFirstName, getSecondName, showTie, initialText};
})(Game);

DisplayManager.initialText();