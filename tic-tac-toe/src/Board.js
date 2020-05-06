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

    this.setSquare(x, y, this.props.playerWhosTurnItIs.marker);

    this.props.squareClickHandler();
  }

  getSquare(x, y) {
    let indexOfSquare = (y * this.props.boardSize) + x;
    return this.state.squares[indexOfSquare];
  }

  setSquare(x, y, playerMarker) {
    console.log(`Entered setSquare; clicked x=${x}, y=${y}. Applying player marker ${playerMarker}.`);
    let indexOfSquare = (y * this.props.boardSize) + x;

    let sqauresTemp = this.state.squares.slice();
    sqauresTemp[indexOfSquare] = playerMarker;

    this.setState({
      squares: sqauresTemp
    });
  }
}