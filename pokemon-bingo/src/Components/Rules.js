import '../Stylesheets/Home.css';
import React from 'react';
import RulesList from './RulesList';
import Navbar from './Navbar';

class Rules extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="home home-body">
        <Navbar />
        <RulesList />
      </div>
    );
  }
}

export default Rules;