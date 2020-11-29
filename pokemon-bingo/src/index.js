import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as firebase from 'firebase';

var firebaseConfig = {
  apiKey: "AIzaSyDn0w9mkuA2a_MuNBEzeY4TcHPs1dDqeK8",
  authDomain: "pokemon-bingo-1f8dc.firebaseapp.com",
  databaseURL: "https://pokemon-bingo-1f8dc.firebaseio.com",
  projectId: "pokemon-bingo-1f8dc",
  storageBucket: "pokemon-bingo-1f8dc.appspot.com",
  messagingSenderId: "836921431846",
  appId: "1:836921431846:web:bc79adc0fd8903e5d213e7",
  measurementId: "G-ZVME4NCQ92"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
