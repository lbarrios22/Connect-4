/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

const makeBoard = () => {
  for (let y = 0; y < HEIGHT; y++)
  {
    board.push(Array.from({ length: WIDTH }));
  }
};


/** makeHtmlBoard: make HTML table and row of column tops. */

const makeHtmlBoard = () => {
  const htmlBoard = document.querySelector('#board');
  // Sets the top row of squares and adds an event listener which listens for a click and has a function called 'handleClick'
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++)
  {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // Makes the rows and cells of the gameboard
  for (let y = 0; y < HEIGHT; y++)
  {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++)
    {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${ y }-${ x }`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
};

/** findSpotForCol: given column x, return top empty y (null if filled) */

const findSpotForCol = (x) => {
  for(let y = HEIGHT - 1; y >= 0; y--){
    if(!board[y][x]){
      return y
    }
  }
  return null;
};

/** placeInTable: update DOM to place piece into HTML table of board */

const placeInTable = (y, x) => {
  const div = document.createElement('div');
  const cell = document.getElementById(`${y}-${x}`);
  div.classList.add('piece')
  div.classList.add(`player-${currPlayer}`)
  div.setAttribute('id', `${ y }-${ x }`);
  cell.append(div);
};

/** endGame: announce game end */

const endGame = (msg) => {
  alert(msg)
};

/** handleClick: handle click of column top to play piece */

const handleClick = (evt) => {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null)
  {
    return;
  }

  // place piece in board and add to HTML table
  board[ y ][ x ] = currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin())
  {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  if (board.every(row => row.every(cell => cell)))
  {
    return endGame('Tie!');
  }

  // switch players
  currPlayer = currPlayer === 1 ? 2 : 1
};

/** checkForWin: check board cell-by-cell for "does a win start here?" */

const checkForWin = () => {
  const win = (cells) => {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([ y, x ]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[ y ][ x ] === currPlayer
    );
  };

  // This iterates through each of the cells horizontally, vertically, and diagonally and chceks if the board has the pieces. If there are four in a row it gives which cells there were pieces in

  for (let y = 0; y < HEIGHT; y++)
  {
    for (let x = 0; x < WIDTH; x++)
    {
      const horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
      const vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
      const diagDR = [ [ y, x ], [ y + 1, x + 1 ], [ y + 2, x + 2 ], [ y + 3, x + 3 ] ];
      const diagDL = [ [ y, x ], [ y + 1, x - 1 ], [ y + 2, x - 2 ], [ y + 3, x - 3 ] ];

      if (win(horiz) || win(vert) || win(diagDR) || win(diagDL))
      {
        return true;
      }
    }
  }
};

makeBoard();
makeHtmlBoard();
