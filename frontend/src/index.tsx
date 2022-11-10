import React, { useState, useContext, createContext } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import { shadePressed, loginPressed, signupPressed } from './hooks/hooks'
import reportWebVitals from './reportWebVitals';
import { PressedProvider } from './contexts/contexts';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <PressedProvider>
      <App />
    </PressedProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
