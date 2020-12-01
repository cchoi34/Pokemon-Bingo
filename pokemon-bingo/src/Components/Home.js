import '../Stylesheets/Home.css';
import React from 'react';
import Rules from './Rules';
import Navbar from './Navbar';

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="home home-body">
        <Navbar />
        <Rules />
      </div>
    );
  }
}

export default Home;