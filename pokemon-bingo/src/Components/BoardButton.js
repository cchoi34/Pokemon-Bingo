import '../Stylesheets/BoardButton.css';
import React from 'react';

class BoardButton extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <button className="board-button" onClick={this.props.onClick}>
        {this.props.name}
      </button>
    );
  }
}

export default BoardButton;