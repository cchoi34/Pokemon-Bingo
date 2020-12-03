import '../Stylesheets/CreateUser.css';
import React from 'react';
import firebase from 'firebase';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBullseye } from '@fortawesome/free-solid-svg-icons';

class CreateUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      loggedIn: false,
      userId: '',
      usernameTaken: false,
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);

    this.getUserData = this.getUserData.bind(this);
    this.submitUserData = this.submitUserData.bind(this);
    this.createUserData = this.createUserData.bind(this);
  }

  componentDidMount() {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      this.setState({
        userId: foundUser.id
      });
    }
  }

  handleLogOut() {
    localStorage.removeItem('user');
    this.setState({
      userId: '',
      loggedIn: false,
    })
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.username.length < 6 || this.state.password < 6) {
      console.log("all fields must be greater than 5 characters");
      return;
    }
    this.submitUserData({
      'username': this.state.username,
      'password': this.state.password,
    });
    
  }

  handleChange(event) {
    const value = event.target.name;
    if (value === "username") {
      this.setState({
        username: event.target.value,
      });
    }
    if (value === "password") {
      this.setState({
        password: event.target.value,
      });
    }
  }

  // *** Firebase Calls ***
  submitUserData(data) {
    const userRef = firebase.database().ref().child('users');
    userRef.orderByChild('username').equalTo(data.username).once('value', (snapshot) => {
      const user = snapshot.val();
      let userData;
      if (user) {
        const userDataArray = Object.values(user);
        userData = this.getUserData(data, userDataArray[0]);
      } else {
        userData = this.createUserData(data);
      }
      // set local storage data
      localStorage.setItem('user', JSON.stringify(userData));
    });
  }
  
  createUserData(data) {
    const userRef = firebase.database().ref('users');
    const username = data.username;
    const password = data.password;
    const id = `ID_${username}`;
    userRef.push({
      username,
      password,
      id,
    });
    this.setState({
      userId: id,
      loggedIn: true,
    });
    return {
      id,
      username,
      password,
    };
  }
  
  getUserData(data, user) {
    if (user.username === data.username && user.password === data.password) {
      this.setState({
        userId: user.id,
        loggedIn: true,
      });
      return {
        'id': user.id,
        'username': user.username,
        'password': user.password,
      };
    } else if (user.username === data.username && user.password !== data.password) {
      this.setState({
        usernameTaken: true,
      })
      return {
        'id': null,
        'username': null,
        'password': null,
      };
    }
  }

  render() {
    const loggedIn = this.state.userId !== '';
    const userMessage = `Hi, ${this.state.userId.substring(3)}!`
    return (
      <div className="create-user-container">
        {
          loggedIn ? 
          <div>
            <h2>
              {userMessage}
            </h2> 
            <button onClick={this.handleLogOut}>Log out</button>
          </div>
          :
          <div>
            <div className="create-user-username">
              <label htmlFor="username">Username</label>
              <input type="text" id="username" name="username" onChange={this.handleChange} ></input>
            </div>

            <div className="create-user-password">
              <label htmlFor="password">Password</label>
              <input type="text" id="password" name="password" onChange={this.handleChange} ></input>
            </div>

            <button onClick={this.handleSubmit}>Submit</button>
          </div>
        }
      </div>
    );
  }
}

export default CreateUser;