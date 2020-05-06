//== imports ==========================================================================================================

import React from 'react';
import Board from './Board';

//== constants ========================================================================================================

const BOARD_SIZE = 3;

const PLAYER_INFO = {
  PLAYER_ONE: {
    marker: 'X'
  },
  PLAYER_TWO: {
    marker: 'O'
  }
};

//== class init =======================================================================================================

export default class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      errorMessage: '',

      playerWhosTurnItIs: PLAYER_INFO.PLAYER_TWO
    };

    this.boardSize = BOARD_SIZE;

    this.moves = [];
  };

  //== render =========================================================================================================

  render() {
    if (this.props.hasError) {
      return (
        <div>Error: {!this.props.errorMessage ? "<No message>" : this.props.errorMessage}</div>
      );

    } else {
      return (
        <div className="game">
          <div className="game-board">
            <Board
              boardSize={this.boardSize}
              playerWhosTurnItIs={this.state.playerWhosTurnItIs}
              squareClickHandler={() => this.onTurn()}
            />
          </div>
          <div className="game-info">
            <div className="status">Next player: {this.state.playerWhosTurnItIs.marker}</div>
            <div className="move-history-list">
              {this.renderMoveHistoryList()}
            </div>
          </div>
        </div>
      );
    }
  };

  renderMoveHistoryList() {
    const moveHistoryList = [];

    for (let i = 0; i < this.moves.length; i++) {
      moveHistoryList.push(this.renderMoveHistoryItem(this.moves[i]));
    }

    return moveHistoryList;
  };

  renderMoveHistoryItem(moveNumber) {
    const moveDescription = moveNumber === 0 ? "game start" : ("move #" + moveNumber);

    return (
      <div className="move-history-item">
        <span>{moveNumber + 1}: </span>
        <button>Go to {moveDescription}</button>
      </div>
    );
  };

  //== helpers ========================================================================================================

  createMove(x, y) {
    if (x < 0 || x >= this.boardSize || y < 0 || y >= this.boardSize) {
      this.makeError(`Co-ordinates [${x},${y}] fall outside of a ${this.boardSize}-sized board.`);
      return undefined;
    }

    return { "x": x, "y": y };
  };

  makeError(message) {
    this.setState({
      hasError: true,
      errorMessage: message
    });
  };

  onTurn() {
    this.updatePlayerWhosTurnItIs();

    // TODO Check victory conditions on board
  }

  /**
   * Updates the player turn state (from the player whos turn it is now, to the next player)
   */
  updatePlayerWhosTurnItIs() {
    this.setState({
      playerWhosTurnItIs: this.nextPlayer(this.state.playerWhosTurnItIs)
    });
  }

  /**
   * Determines who's turn it is next.
   * 
   * @param {*} currentPlayer The current player.
   */
  nextPlayer(currentPlayer) {
    if (currentPlayer === PLAYER_INFO.PLAYER_ONE) {
      return PLAYER_INFO.PLAYER_TWO;

    } else if (currentPlayer === PLAYER_INFO.PLAYER_TWO) {
      return PLAYER_INFO.PLAYER_ONE;

    } else {
      return undefined;
    }
  }
}