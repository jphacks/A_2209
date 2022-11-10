import React, { memo, useState, useContext } from 'react';
import {Box, Button, Card, CardActions, CardContent, CardHeader, TextField, IconButton} from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';
import CloseIcon from '@mui/icons-material/Close';

import { redirect } from "react-router-dom";
// Import the functions you need from the SDKs you need
// import firebase from "firebase"
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

import firebaseConfig from '../apis';
import { getFirestore } from 'firebase/firestore/lite';

// import { shadePressed, loginPressed, signupPressed } from '../hooks/hooks';
import { pressedType, Pressed } from '../contexts/contexts';
import '../css/signin.css';

const provider = new GoogleAuthProvider();

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase

export const Signin = memo(() => {

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  function redirect_home_signedin() {
    isPressed.setShade(false);
    isPressed.setSignin(false);
    isPressed.setSignup(false);
    redirect("/");
    isPressed.setIsSignedin(true);
  };

  function redirect_home_signedout() {
    isPressed.setShade(false);
    isPressed.setSignin(false);
    isPressed.setSignup(false);
    redirect("/");
    isPressed.setIsSignedin(false);
  };

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
    height: "500px",
    width: "90vw",
    maxWidth: "450px",
    variant: "outlined",
  };

  const onClickLogin = async () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode)
        console.log(errorMessage)
      });
  };

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      redirect_home_signedin();
      const uid = user.uid;
      // ...
    } else {
      // User is signed out
      // ...
      redirect_home_signedout();
    }
  });

  const [email, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const isPressed: pressedType = useContext(Pressed);

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Card style={cardStyle}>
          <CardHeader title="ログイン" />
          <CardContent>
            <div>
              <IconButton
                onClick={() => {
                  isPressed.setShade(false);
                  isPressed.setSignin(false);
                  isPressed.setSignup(false);
                }}
                className="closeIcon"
              >
                <CloseIcon></CloseIcon>
              </IconButton>
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
          <p className="toSignup">アカウント登録をお持ちでない方</p>
          <CardActions>
            <Button
              variant="contained"
              // color="default"
              style={{
                margin: "0 auto",
              }}
              onClick={() => {
                isPressed.setSignin(false);
                isPressed.setSignup(true);
              }}
            >
            アカウント新規登録
            </Button>
          </CardActions>
        </Card>
      </Box>
    </>
  );
});