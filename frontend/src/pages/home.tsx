import React from 'react';
import {Box, Button, Card, CardActions, CardContent, CardHeader, TextField} from "@mui/material";
// import './index.css';
import firebaseConfig from '../firebaseConfig.json';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
// import axios from "axios";
import { memo, useState } from "react";
// import { User } from "../types/User";
// import { useNavigate } from "react-router-dom";

// Import the functions you need from the SDKs you need
// import firebase from "firebase"
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase
// var ui = new firebaseui.auth.AuthUI(firebase.auth());


// async function getCities(db) {
//   const citiesCol = collection(db, 'cities');
//   const citySnapshot = await getDocs(citiesCol);
//   const cityList = citySnapshot.docs.map(doc => doc.data());
//   return cityList;
// }

const Home: React.FC = () => {

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
  const analytics = getAnalytics(app);


  const cardStyle = {
    display: "block",
    transitionDuration: "0.3s",
    height: "450px",
    width: "400px",
    variant: "outlined",
  };

  const onClickLogin = async () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user)
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode)
        console.log(errorMessage)
      });
  };

  const [email, setUserId] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        padding={20}
      >
        <Card style={cardStyle}>
          <CardHeader title="ログイン" />
          <CardContent>
            <div>
              <TextField
                fullWidth
                id="email"
                type="email"
                label="Email"
                placeholder="Email"
                margin="normal"
                onChange={(e) => setUserId(e.target.value)}
              />
              <TextField
                fullWidth
                id="password"
                type="password"
                label="Password"
                placeholder="Password"
                margin="normal"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardActions>
            <Button className='login'
              variant="contained"
              size="large"
              color="primary"
              onClick={onClickLogin}
            >
              Login
            </Button>
          </CardActions>
          <p className="signup-link">アカウント登録がお済でない方は<span><a href='na.html'>こちら</a></span>をクリック</p>
        </Card>
      </Box>
    </>
  );
};

export default Home;
