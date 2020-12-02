import '../Stylesheets/CreateUser.css';
import React from 'react';
import firebase from 'firebase';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBullseye } from '@fortawesome/free-solid-svg-icons';

class CreateUser extends React.Component {
  render() {
    return (
      <div className="create-user-container">
        <div className="create-user-username">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username"></input>
        </div>

        <div className="create-user-password">
          <label htmlFor="password">Password</label>
          <input type="text" id="password" name="password"></input>
        </div>
      </div>
    );
  }
}

export default CreateUser;