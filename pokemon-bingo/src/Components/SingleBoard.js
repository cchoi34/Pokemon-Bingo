import '../Stylesheets/Home.css';
import React from 'react';
import BingoBoard from './BingoBoard';
import Navbar from './Navbar';

class SingleBoard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="home home-body">
        <Navbar />
        <BingoBoard />
      </div>
    );
  }
}

export default SingleBoard;