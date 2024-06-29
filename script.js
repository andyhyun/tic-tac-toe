"use strict";

// This represents the state of the board
function createGameBoard() {
    const board = new Array(3).fill(0).map(() => new Array(3).fill(0));

    const getBoard = () => board;

    const markSpace = (r, c, player) => {
        board[r][c] = player.token
    };

    const resetBoard = () => {
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                board[r][c] = 0;
            }
        }
    };

    const printBoard = () => {
        let printStr = "";

        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                printStr += `${board[r][c]} `;
            }
            printStr += "\n";
        }

        console.log(printStr);
    };

    return {
        getBoard,
        markSpace,
        resetBoard,
        printBoard,
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

    const switchTurns = () => {
        activePlayer = (activePlayer === players[0]) ? players[1] : players[0];
    };

    const hasWon = (player) => {
        const board = gameBoard.getBoard();
        let streak;

        // Check rows
        for (let r = 0; r < 3; r++) {
            streak = 0;

            for (let c = 0; c < 3; c++) {
                if (board[r][c] !== player.token) {
                    break;
                }
                streak++;
            }

            if (streak === 3) {
                return true;
            }
        }

        // Check columns
        for (let c = 0; c < 3; c++) {
            streak = 0;

            for (let r = 0; r < 3; r++) {
                if (board[r][c] !== player.token) {
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

        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                if (board[r][c] === 0) {
                    return false;
                }
            }
        }

        return true;
    };

    const makeMove = () => {
        const [r, c] = prompt(`${activePlayer.name}'s turn, enter row and column below separated by spaces`).split(" ");

        gameBoard.markSpace(Number(r), Number(c), activePlayer);
        gameBoard.printBoard();

        if (hasWon(activePlayer)) {
            console.log(`${activePlayer.name} won!`);
        } else if (hasTied()) {
            console.log("The game ended in a tie.");
        }

        switchTurns();
    };

    return {
        hasWon,
        hasTied,
        makeMove,
    };
};

const game = createGameController();

