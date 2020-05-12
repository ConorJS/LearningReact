//== imports ==========================================================================================================

import React from 'react';
import Board from './Board';

//== constants ========================================================================================================

const BOARD_SIZE = 3;

const PLAYER_INFO = {
  PLAYER_ONE: {
    name: 'Player 1 (X)',
    marker: 'X'
  },
  PLAYER_TWO: {
    name: 'Player 2 (O)',
    marker: 'O'
  }
};

//== class init =======================================================================================================

export default class Game extends React.Component {
  constructor(props) {
    super(props);

    this.boardSize = BOARD_SIZE;

    this.state = {
      hasError: false,
      errorMessage: '',

      playerWhosTurnItIs: PLAYER_INFO.PLAYER_TWO,
      playerWhoHasWon: null,

      moves: Array(this.boardSize),
      selectedMove: 0
    };
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
              playerHasWonCallback={(winner) => this.playerHasWonCallback(winner)}
              gameInProgress={this.state.playerWhoHasWon === null}
            />
          </div>

          <div className="game-info">
            <div className="status">{this.renderStatusMessage()}</div>
            <div className="move-history-list">
              {this.renderMoveHistoryList()}
            </div>
          </div>
        </div>
      );
    }
  };

  renderStatusMessage() {
    if (this.state.playerWhoHasWon === null) {
      return `Next player: ${this.state.playerWhosTurnItIs.marker}`;
    } else {
      return `Winning player: ${this.state.playerWhoHasWon.name}`;
    }
  }

  renderMoveHistoryList() {
    const moveHistoryList = [];

    for (let i = 0; i < this.state.moves.length; i++) {
      let move = this.state.moves[i];
      if (!!move) {
        moveHistoryList.push(this.renderMoveHistoryItem(move, i));
      }
    }

    return moveHistoryList;
  };

  renderMoveHistoryItem(move, index) {
    const moveDescription = index === 0 ? "game start" : ("move #" + index);

    // TODO: Move histories don't have unique keys...
    return (
      <div className="move-history-item">
        <span>{index + 1}: </span>
        <button>Go to {moveDescription}</button>
      </div>
    );
  };

  //== helpers ========================================================================================================

  makeError(message) {
    this.setState({
      hasError: true,
      errorMessage: message
    });
  };

  /**
   * Updates the player turn state (from the player whos turn it is now, to the next player).
   * Stores the move history.
   */
  onTurn(x, y, playerMarker) {
    // In normal gameplay (where the user hasn't click move history buttons), we might be on 
    // move 4 of a game, and the 'selectedMove' counter will be as such. However, the user 
    // can click to view a previous move (say, move 2), and the board will update, but the moves
    // visible will remain the same, until a move is played, and then all of the history down to
    // the last two moves will be erased, and the *new* move 3 will be added to the move list.
    let movesTemp;
    if (this.state.selectedMove === this.state.moves.length - 1) {
      movesTemp = this.state.moves.splice();
    } else {
      movesTemp = this.state.moves.splice(0, this.state.selectedMove);
    }

    movesTemp.push(this.createMoveHistoryItem(x, y, playerMarker));

    this.setState({
      playerWhosTurnItIs: this.nextPlayer(this.state.playerWhosTurnItIs),
      moves: movesTemp,
      selectedMove: this.state.selectedMove + 1
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

  /**
   * Creates a move history item representing the move number, position and the player who made the move.
   * 
   * @param {Number} x The x-coordinate that the move took place on.
   * @param {Number} y The y-coordinate that the move took place on.
   * @param {String} playerMarker The marker of the player that made the move.
   */
  createMoveHistoryItem(x, y, playerMarker) {
    return {
      x: x,
      y: y,
      playerMarker: playerMarker
    };
  }

  playerHasWonCallback(playerMarker) {
    console.log(`playerHasWonCallback: Signalling that player with marker ${playerMarker} won.`);

    if (PLAYER_INFO.PLAYER_ONE.marker === playerMarker) {
      this.setState({
        playerWhoHasWon: PLAYER_INFO.PLAYER_ONE
      });

    } else if (PLAYER_INFO.PLAYER_TWO.marker === playerMarker) {
      this.setState({
        playerWhoHasWon: PLAYER_INFO.PLAYER_TWO
      });

    } else {
      this.setState({
        hasError: true,
        errorMessage: `Player with unknown marker ${playerMarker} won.`
      });
    }
  }
}