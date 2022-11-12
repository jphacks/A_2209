import React, { useState, useEffect, useContext, createContext } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

import firebaseConfig from '../apis';

export interface pressedType {
  shade: boolean;
  signin: boolean;
  signup: boolean;
  userUtils: boolean;
  isSignedin: boolean;
  alert: boolean;
  user: any;
  alertState: string;
  setShade: (shade: boolean) => void;
  setSignin: (signin: boolean) => void;
  setSignup: (signup: boolean) => void;
  setUserUtils: (userUtils: boolean) => void;
  setIsSignedin: (isSignedin: boolean) => void;
  setAlert: (alert: boolean) => void;
  setUser: (user: any) => void;
  setAlertState: (alertState: string) => void;
}

// AppContext の生成
export const Pressed = createContext<pressedType>({
  shade: false,
  signin: false,
  signup: false,
  userUtils: false,
  isSignedin: false,
  alert: false,
  user: '',
  alertState: '',
  setShade: (shade: boolean) => {},
  setSignin: (signin: boolean) => {},
  setSignup: (signup: boolean) => {},
  setUserUtils: (userUtils: boolean) => {},
  setIsSignedin: (isSignedin: boolean) => {},
  setAlert: (alert: boolean) => {},
  setUser: (user: any) => {},
  setAlertState: (alertState: string) => {},
});

// AppContext にセッター関数を登録するためのコンポーネント
export const PressedProvider: React.FC<{ children: any}> = ({children}) => {

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  // デフォルト値の取得用
  const context: pressedType = useContext(Pressed);

  // ステートオブジェクト作成
  const [shade, setShade] = useState(context.shade);
  const [signin, setSignin] = useState(context.signin);
  const [signup, setSignup] = useState(context.signup);
  const [userUtils, setUserUtils] = useState(context.userUtils);
  const [isSignedin, setIsSignedin] = useState(context.isSignedin);
  const [alert, setAlert] = useState(context.alert);
  const [user, setUser] = useState(context.user);
  const [alertState, setAlertState] = useState(context.alertState);

  useEffect(() => {
    const unsubscribed = auth.onAuthStateChanged((user:any) => {
      console.log(user);
      setUser(user);
      if (user != null){
        setIsSignedin(true);
      }
    });
    return () => {
      unsubscribed();
    };
  }, []);

  // 下位コンポーネントへ渡す Context
  const newContext: pressedType = {
    shade, setShade, signin, setSignin, signup, setSignup, isSignedin, setIsSignedin, alert, setAlert, user, setUser, userUtils, setUserUtils, alertState, setAlertState
  };

  return (
    <Pressed.Provider value={newContext}>
      {children}
    </Pressed.Provider>
  );
};
