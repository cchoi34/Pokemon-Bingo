import '../Stylesheets/Home.css';
import React from 'react';
import BingoBoard from './BingoBoard';
import Navbar from './Navbar';
import CreateUser from './CreateUser';

class Board extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const id = this.props.match.params.id;

    return (
      <div className="home home-body">
        <Navbar />
        <BingoBoard id={id} />
      </div>
    );
  }
}

export default Board;