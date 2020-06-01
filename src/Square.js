import React from 'react';

export default class Square extends React.Component {
  render() {
    return (
      <button
        className="square"
        onClick={this.props.clickHandler}>
        {this.props.playerMarker}
      </button>
    );
  }
}