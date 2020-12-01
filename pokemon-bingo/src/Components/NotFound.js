import '../Stylesheets/Home.css';
import React from 'react';
import Navbar from './Navbar';

class NotFound extends React.Component {
  render() {
    return (
      <div className="home home-body">
        <Navbar />
        <h1>Sorry, the page you are looking for can't be found!</h1>
      </div>
    );
  }
}

export default NotFound;