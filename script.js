"use strict";

// This represents the state of the board
function createGameBoard() {
    const board = new Array(3).fill(0).map(() => new Array(3).fill(0));

    const getBoard = () => board;

    const markSpace = (row, col, player) => {
        board[row][col] = player.token
    };

    const resetBoard = () => {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                board[row][col] = 0;
            }
        }
    };

    return {
        getBoard,
        markSpace,
        resetBoard,
    };
}

// This controls the flow of the game itself
function createGameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two",
) {
    const gameBoard = createGameBoard();

    // Player token must be non-zero, as zero represents
    // an empty space on the board
    const players = [
        {
            name: playerOneName,
            token: 1,
        },
        {
            name: playerTwoName,
            token: 2,
        },
    ];

    let activePlayer = players[0];

    const getActivePlayer = () => activePlayer;

    const switchTurns = () => {
        activePlayer = (activePlayer === players[0]) ? players[1] : players[0];
    };

    const resetGame = () => {
        activePlayer = players[0];
        gameBoard.resetBoard();
    };

    const hasWon = (player) => {
        const board = gameBoard.getBoard();
        let streak;

        // Check rows
        for (let row = 0; row < 3; row++) {
            streak = 0;

            for (let col = 0; col < 3; col++) {
                if (board[row][col] !== player.token) {
                    break;
                }
                streak++;
            }

            if (streak === 3) {
                return true;
            }
        }

        // Check columns
        for (let col = 0; col < 3; col++) {
            streak = 0;

            for (let row = 0; row < 3; row++) {
                if (board[row][col] !== player.token) {
                    break;
                }
                streak++;
            }

            if (streak === 3) {
                return true;
            }
        }

        // Check diagonal
        streak = 0;
        for (let i = 0; i < 3; i++) {
            if (board[i][i] !== player.token) {
                break;
            }

            streak++;

            if (streak === 3) {
                return true;
            }
        }

        // Check the other diagonal
        streak = 0;
        for (let i = 0; i < 3; i++) {
            if (board[i][3 - (i + 1)] !== player.token) {
                break;
            }

            streak++;

            if (streak === 3) {
                return true;
            }
        }

        return false;
    };

    const hasTied = () => {
        const board = gameBoard.getBoard();

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (board[row][col] === 0) {
                    return false;
                }
            }
        }

        return true;
    };

    const makeMove = (row, col) => {
        gameBoard.markSpace(Number(row), Number(col), activePlayer);

        if (hasWon(activePlayer)) {
            return;
        }

        switchTurns();
    };

    return {
        getActivePlayer,
        resetGame,
        hasWon,
        hasTied,
        makeMove,
        getBoard: gameBoard.getBoard,
    };
}

// Updates the user interface
function createDisplayController(playerOneName, playerTwoName) {
    document.body.textContent = "";

    const game = createGameController(playerOneName, playerTwoName);

    const boardDiv = document.createElement("div");
    boardDiv.id = "board";

    const turnDiv = document.createElement("div");
    turnDiv.id = "turn";

    const resetButton = document.createElement("button");
    resetButton.type = "button";
    resetButton.id = "reset";
    resetButton.textContent = "Reset";

    const result = document.createElement("p");
    result.id = "result";

    document.body.appendChild(boardDiv);
    document.body.appendChild(turnDiv);
    document.body.appendChild(resetButton);
    document.body.appendChild(result);

    const updateScreen = () => {
        boardDiv.textContent = "";

        const activePlayer = game.getActivePlayer();
        turnDiv.textContent = `It is ${activePlayer.name}'s turn.`;

        const board = game.getBoard();
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const cellButton = document.createElement("button");
                cellButton.dataset.row = row;
                cellButton.dataset.col = col;
                cellButton.textContent = board[row][col];

                boardDiv.appendChild(cellButton);
            }
        }

        if (game.hasWon(activePlayer)) {
            result.textContent = `${activePlayer.name} won!`;
        } else if (game.hasTied()) {
            result.textContent = "The game ended in a tie.";
        } else {
            result.textContent = "";
        }
    };

    const handleBoardClick = (event) => {
        // Make sure a cell was clicked
        if (!event.target.dataset.row || !event.target.dataset.col) {
            return;
        }

        const row = Number(event.target.dataset.row);
        const col = Number(event.target.dataset.col);
        const board = game.getBoard();

        // Prevent player from marking taken spots
        if (board[row][col] !== 0) {
            return;
        }

        game.makeMove(row, col);
        updateScreen();
    };

    resetButton.addEventListener("click", () => {
        game.resetGame();
        updateScreen();
    });

    boardDiv.addEventListener("click", handleBoardClick);

    updateScreen();
}

const form = document.querySelector("form");
const playButton = document.getElementById("play");

playButton.addEventListener("click", (event) => {
    for (const element of form) {
        if (!element.validity.valid) {
            return;
        }
    }

    event.preventDefault();

    createDisplayController(form[0].value, form[1].value);
});

