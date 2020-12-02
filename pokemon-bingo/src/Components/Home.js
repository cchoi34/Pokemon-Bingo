import '../Stylesheets/Home.css';
import React from 'react';
import CreateUser from './CreateUser';
import Navbar from './Navbar';

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="home home-body">
        <Navbar />
        <CreateUser />
      </div>
    );
  }
}

export default Home;