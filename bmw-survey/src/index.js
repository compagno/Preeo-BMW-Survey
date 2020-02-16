import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyD1rg3ToJ7qav9Jun_rGOVqwUflX4lmXYY",
  authDomain: "bmw-survey.firebaseapp.com",
  databaseURL: "https://bmw-survey.firebaseio.com",
  projectId: "bmw-survey",
  storageBucket: "bmw-survey.appspot.com",
  messagingSenderId: "42874147495",
  appId: "1:42874147495:web:f84118855cc5d631c6c182",
  measurementId: "G-RS57R5QL4V"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

ReactDOM.render(<App />, document.getElementById("root"));
