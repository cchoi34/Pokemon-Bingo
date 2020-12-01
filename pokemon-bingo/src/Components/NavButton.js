import '../Stylesheets/NavButton.css';
import React from 'react';

class NewBoardButton extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <button className="nav-button" onClick={this.props.onClick}>
        {this.props.name}
      </button>
    );
  }
}

export default NewBoardButton;