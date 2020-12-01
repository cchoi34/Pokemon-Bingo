import '../Stylesheets/Navbar.css';
import { Link } from 'react-router-dom';
import React from 'react';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newBoard: 'New Board',
      shareBoard: 'Share Board',
    }
  }

  render() {
    return (
      <div className="navbar">
        <ul className="navbar-list">
          <li className="navbar-list-item">
            <Link to='/'>Home</Link>
          </li>
          <li className="navbar-list-item">
            <Link to='/board'>Board</Link>
          </li>
          <li className="navbar-list-item">
            <Link to='/rules'>Rules</Link>
          </li>
        </ul>
      </div>
    );
  }
}

export default Navbar;