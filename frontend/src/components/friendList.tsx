import React, { memo, useState, useContext } from 'react';
import {Box, Button, Card, CardActions, CardContent, CardHeader, TextField, IconButton} from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';

import { redirect } from "react-router-dom";
// Import the functions you need from the SDKs you need
// import firebase from "firebase"
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
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

export const UserUtils = memo(() => {

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
    isPressed.setIsSignedin(false);
    isPressed.setUserUtils(false);
    isPressed.setUser(null);
    redirect("/");
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

  const onClickLogout = async () => {
    signOut(auth)
      .then(() => {
        redirect_home_signedout();
      })
      .catch(() => {
        alert('ログアウト失敗')
      });
  };

  // onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     // User is signed in, see docs for a list of available properties
  //     // https://firebase.google.com/docs/reference/js/firebase.User
  //     redirect_home_signedin();
  //     const uid = user.uid;
  //     // ...
  //   } else {
  //     // User is signed out
  //     // ...
  //     redirect_home_signedout();
  //   }
  // });

  const [email, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const isPressed: pressedType = useContext(Pressed);

  if(isPressed.user.uid){
    var displayName: string = isPressed.user.uid;
  }else{
    var displayName: string = '';
  }

  return (
    <>
      <List
        sx={{
          width: '80vw',
          maxWidth: "450px",
          bgcolor: 'background.paper'
        }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            {displayName}
            <IconButton
              onClick={() => {
                isPressed.setShade(false);
                isPressed.setUserUtils(false);
              }}
            >
              <CloseIcon />
            </IconButton>
          </ListSubheader>
        }
      >
        <ListItemButton
          onClick={onClickLogout}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="ログアウト" />
        </ListItemButton>
        {/* <ListItemButton>
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText primary="Drafts" />
        </ListItemButton> */}
        {/* <ListItemButton onClick={handleClick}>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="Inbox" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton> */}
        {/* <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary="Starred" />
            </ListItemButton>
          </List>
        </Collapse> */}
      </List>
    </>
  );
});
