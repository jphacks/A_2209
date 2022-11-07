import React from 'react';
import {Box, Button, Card, CardActions, CardContent, CardHeader, TextField, Avatar, makeStyles} from "@mui/material";
// import './index.css';
import firebaseConfig from '../firebaseConfig.json';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
// import axios from "axios";
import { memo, useState } from "react";
// import { User } from "../types/User";
import { Link } from "react-router-dom";

// Import the functions you need from the SDKs you need
// import firebase from "firebase"
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const provider = new GoogleAuthProvider();

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

  const useStyles = makeStyles((theme:any) => ({
    button: {
        backgroundColor: "#fff",
        height: theme.spacing(5),
        '&:hover': {
            background: "#fff",
            boxShadow: "0 0 6px #4285f4"
        },
    },
    small: {
        width: theme.spacing(2),
        height: theme.spacing(2),
    },
  }));

  const classes = useStyles

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
          <p className="signup-link">アカウント登録がお済でない方は<Link to={'/signup'}>こちら</Link>をクリック</p>
          <CardActions>
            <Button
              variant="outlined"
              // color="default"
              startIcon={<Avatar src={'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg'} className={classes.small} />}
              style={{textTransform: 'capitalize'}}
              className={classes.button}
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
