import React, { memo, useState, useContext } from 'react';
import { Box, Button, Card, CardActions, CardContent, CardHeader, TextField, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

// import { Link } from 'react-router-dom';

// Import the functions you need from the SDKs you need
// import firebase from "firebase"
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

import firebaseConfig from '../apis';
import { getFirestore, collection, getDocs, getDoc, addDoc, doc, setDoc } from 'firebase/firestore';

import { pressedType, Pressed } from '../contexts/contexts';
import '../css/signup.css'

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

export const Signup = memo(() => {

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
  const analytics = getAnalytics(app);

  const cardStyle = {
    display: "block",
    transitionDuration: "0.3s",
    height: "550px",
    width: "90vw",
    maxWidth: "450px",
    variant: "outlined",
  };

  const onClickSignup = async () => {
    // const docRef = doc(db, "users", username);
    // const user = await getDoc(docRef);
    // if (user.exists()) {
    //   return('error')
    // }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user)
        // ...
        try {
          const attrRef = setDoc(doc(db, "users", username, "userdata", "attributes"), {
            email: email,
            username: username,
            password: password
          });
          const friendsRef = setDoc(doc(db, "users", username, "friends", "friends"), {
            blocked: [],
            friends: [],
            receivedRequests: [],
            sentRequests: [],
          });
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode)
        console.log(errorMessage)
      });

  };

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
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
          <CardHeader title="アカウント新規登録" />
          <CardContent>
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
            <div>
              <TextField
                fullWidth
                id="username"
                type="username"
                label="ユーザー名"
                placeholder="ユーザー名"
                margin="normal"
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                fullWidth
                id="email"
                type="email"
                label="メールアドレス"
                placeholder="メールアドレス"
                margin="normal"
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                fullWidth
                id="password"
                type="password"
                label="パスワード"
                placeholder="パスワード"
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
              onClick={onClickSignup}
            >
              Sign up
            </Button>
          </CardActions>
          <p className="toSignup">既にアカウントをお持ちの方</p>
          <CardActions>
            <Button
              variant="contained"
              // color="default"
              style={{
                margin: "0 auto"
              }}
              onClick={() => {
                isPressed.setSignin(true);
                isPressed.setSignup(false);
              }}
            >
            ログイン
            </Button>
          </CardActions>
        </Card>
      </Box>
    </>
  );
});
