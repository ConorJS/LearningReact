//== imports ==========================================================================================================

import React from 'react';
import Square from './Square';

//== class init =======================================================================================================

export default class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Squares should just contain a reference to the player that 'owns' the square, or null if none do.
      squares: Array(this.props.boardSize * this.props.boardSize).fill(null)
    };
  }

  //== render =========================================================================================================

  render() {
    let rowsInTable = [];

    for (let i = 0; i < this.props.boardSize; i++) {
      rowsInTable.push(this.renderRow(i));
    }

    return (
      <div>{rowsInTable}</div>
    );
  };

  /**
   * Renders a whole row, using {@link renderSquare}.
   * 
   * @param {*} rowNumber The row number to render (0 is the top row).
   */
  renderRow(rowNumber) {
    const squaresInRow = [];

    for (let i = 0; i < this.props.boardSize; i++) {
      squaresInRow.push(this.renderSquare(i, rowNumber, this.getSquare(i, rowNumber)));
    }

    return <div key={`row${rowNumber}`} className="board-row">{squaresInRow}</div>;
  };

  /**
   * Renders a single square.
   * 
   * @param {*} x The x-coordinate of the square in the game matrix.
   * @param {*} y The y-coordinate of the square in the game matrix.
   * @param {*} playerMarker The marker of the player that 'owns' the square (can be null if none does).
   */
  renderSquare(x, y, playerMarker) {
    return <Square
      key={`square_x_${x}_y_${y}`}
      clickHandler={() => this.squareClickHandler(x, y)}
      playerMarker={playerMarker}>
    </Square>;
  };

  //== helpers ========================================================================================================

  componentDidCatch(error, info) {
    console.log(`In componentDidCatch ERROR: ${error}, INFO: ${info}`);
    this.setState({ hasError: true });
  };

  squareClickHandler(x, y) {
    console.log(`Clicked x=${x}, y=${y}`);

    if (this.getSquare(x, y) == null) {
      // Play out the turn if the square isn't occupied.
      this.setSquare(x, y, this.props.playerWhosTurnItIs.marker, this.afterSquarePlacedCallback);

    } else {
      // Do nothing if the square is already occupied; an invalid move was selected.
      console.log(`Square x=${x}, y=${y} is already occupied with another player's marker!`)
    }
  }

  afterSquarePlacedCallback() {
    this.props.squareClickHandler();

    let winningMarker = this.getMarkerUsedInCompleteLineIfPresent();
    if (winningMarker != null) {
      this.props.playerHasWonCallback(winningMarker);
    }
  }

  getSquare(x, y) {
    let indexOfSquare = (y * this.props.boardSize) + x;
    return this.state.squares[indexOfSquare];
  }

  setSquare(x, y, playerMarker, callback) {
    console.log(`Entered setSquare; clicked x=${x}, y=${y}. Applying player marker ${playerMarker}.`);
    let indexOfSquare = (y * this.props.boardSize) + x;

    let sqauresTemp = this.state.squares.slice();
    sqauresTemp[indexOfSquare] = playerMarker;

    this.setState({ squares: sqauresTemp }, callback);
  }

  /**
   * If there is complete line of markers from the board (i.e a winning game state for the player holding said markers) 
   * then this returns the marker that this line is composed of.
   * 
   * If nobody has a complete line (i.e. the game is not yet over), this returns null.
   */
  getMarkerUsedInCompleteLineIfPresent() {
    let winningMarker = this.getCompleteStraightLineIfPresent(true);
    if (winningMarker !== null) {
      return winningMarker;
    }
    
    winningMarker = this.getCompleteStraightLineIfPresent(false);
    if (winningMarker !== null) {
      return winningMarker;
    }

    // TODO: Diagonals
    return null;
  }

  /**
   * Gets a complete straight line if present.
   * 
   * @param {boolean} columns If we're looking for columns (else, rows)
   */
  getCompleteStraightLineIfPresent(columns) {
    // Check for complete lines (columns )
    for (let line = 0; line < this.props.boardSize; line++) {

      let lineCouldStillBeWinningMove = true;
      let markerThatCouldWin = null;
      for (let squareInline = 0; squareInline < this.props.boardSize; squareInline++) {
        if (lineCouldStillBeWinningMove) {
          // The line number corresponds with the x co-ordinate for column checking, and y for row checking.
          let markerInSquare = !!columns ? this.getSquare(line, squareInline) : this.getSquare(squareInline, line);

          if (markerInSquare === null) {
            // The line can't be a winning line if there is a blank square in it.
            lineCouldStillBeWinningMove = false;

          } else if (markerThatCouldWin === null) {
            // The marker in the square we are checking is not null, 
            // and we must be on the first iteration (we haven't set 'markerThatCouldWin' yet), so set this value now.
            markerThatCouldWin = markerInSquare;

          } else if (markerInSquare !== markerThatCouldWin) {
            // The line has only had one type of character (so far), but this has been interrupted.
            lineCouldStillBeWinningMove = false;
          }
        }
      }

      if (lineCouldStillBeWinningMove) {
        console.log(`Winning move found from ${markerThatCouldWin}: ${columns ? 'column' : 'row'} column ${line}`);
        return markerThatCouldWin;
      }
    }

    // No complete line was found.
    return null;
  }
}