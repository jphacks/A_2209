import React from 'react';
import {Box, Button, Card, CardActions, CardContent, CardHeader, TextField} from "@mui/material";
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { BrowserRouter, Link, Route, Routes} from "react-router-dom";
// import axios from "axios";
import { memo, useState } from "react";
// import { useNavigate } from "react-router-dom";

// Import the functions you need from the SDKs you need
// import firebase from "firebase"
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import {Signin} from '../components/signin'
import {Signup} from '../components/signup'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


export const Router = () => {

  return (
    <>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
};
