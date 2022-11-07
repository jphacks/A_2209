import React from 'react';
// import {Box, Button, Card, CardActions, CardContent, CardHeader, TextField} from "@mui/material";
import './index.css';
import firebaseConfig from './firebaseConfig.json';
// import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { BrowserRouter, Link, createBrowserRouter, RouterProvider, Route, Routes} from "react-router-dom";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// Import the functions you need from the SDKs you need
// import firebase from "firebase"
// import { initializeApp } from "firebase/app";
// import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
import {Signin} from './components/signin'
import {Signup} from './components/signup'
import Home from './pages/home'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/signin' element={<Signin />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
