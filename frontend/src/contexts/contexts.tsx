import React, { useState, useEffect, useContext, createContext } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

import firebaseConfig from '../firebaseConfig.json';

export interface pressedType {
  shade: boolean;
  signin: boolean;
  signup: boolean;
  userUtils: boolean;
  isSignedin: boolean;
  user: any;
  setShade: (shade: boolean) => void;
  setSignin: (signin: boolean) => void;
  setSignup: (signup: boolean) => void;
  setUserUtils: (userUtils: boolean) => void;
  setIsSignedin: (isSignedin: boolean) => void;
  setUser: (user: any) => void;
}

// AppContext の生成
export const Pressed = createContext<pressedType>({
  shade: false,
  signin: false,
  signup: false,
  userUtils: false,
  isSignedin: false,
  user: '',
  setShade: (shade: boolean) => {},
  setSignin: (signin: boolean) => {},
  setSignup: (signup: boolean) => {},
  setUserUtils: (userUtils: boolean) => {},
  setIsSignedin: (isSignedin: boolean) => {},
  setUser: (user: any) => {},
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
  const [user, setUser] = useState(context.user);

  useEffect(() => {
    const unsubscribed = auth.onAuthStateChanged((user:any) => {
      console.log(user);
      console.log(typeof user);
      setUser(user);
      setIsSignedin(true);
    });
    return () => {
      unsubscribed();
    };
  }, []);

  // 下位コンポーネントへ渡す Context
  const newContext: pressedType = {
    shade, setShade, signin, setSignin, signup, setSignup, isSignedin, setIsSignedin, user, setUser, userUtils, setUserUtils
  };

  return (
    <Pressed.Provider value={newContext}>
      {children}
    </Pressed.Provider>
  );
};
