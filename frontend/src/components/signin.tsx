import React, { memo, useState } from 'react';
import {Box, Button, Card, CardActions, CardContent, CardHeader, TextField, Avatar, makeStyles} from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import { Link } from "react-router-dom";
// Import the functions you need from the SDKs you need
// import firebase from "firebase"
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

import firebaseConfig from '../firebaseConfig.json';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';

const provider = new GoogleAuthProvider();

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase

export const Signin = memo(() => {

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
  const analytics = getAnalytics(app);

  function onGoogleButoonClick(){
    signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential:any = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
  }

  const cardStyle = {
    display: "block",
    transitionDuration: "0.3s",
    height: "450px",
    width: "90vw",
    maxWidth: "400px",
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
        marginTop="5vh"
      >
        <Card style={cardStyle}>
          <Link to={'/'}><ArrowBackIosIcon></ArrowBackIosIcon>戻る</Link>
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
          <p className="signup-link">アカウント登録がお済でない方は<Link to={'/signup'}>こちら</Link>をクリック</p>
          <CardActions>
            <Button
              variant="outlined"
              // color="default"
              startIcon={
                <GoogleIcon></GoogleIcon>
              }
              style={{textTransform: 'capitalize'}}
              onClick={onGoogleButoonClick}
            >
            Sign in with Google
            </Button>
          </CardActions>
        </Card>
      </Box>
    </>
  );
});
