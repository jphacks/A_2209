import React, { useState, useContext, createContext } from "react";

// export const useShadePressed = () => {
//   const [shadePressed, setShadePressed] = useState(false);

//   const shadePressedtoFalse = () => setShadePressed(false);
//   const shadePressedtoTrue = () => setShadePressed(true);

//   return {shadePressed, setShadePressed, shadePressedtoFalse, shadePressedtoTrue};
// };

// export const useLoginPressed = () => {
//   const [loginPressed, setLoginPressed] = useState(false);

//   const loginPressedtoFalse = () => setLoginPressed(false);
//   const loginPressedtoTrue = () => setLoginPressed(true);

//   return {loginPressed, setLoginPressed, loginPressedtoFalse, loginPressedtoTrue};
// };

// export const useSignupPressed = () => {
//   const [signupPressed, setSignupPressed] = useState(false);

//   const signupPressedtoFalse = () => setSignupPressed(false);
//   const signupPressedtoTrue = () => setSignupPressed(true);

//   return {signupPressed, setSignupPressed, signupPressedtoFalse, signupPressedtoTrue};
// };

// export const shadePressed = createContext(false);
// export const loginPressed = createContext(false);
// export const signupPressed = createContext(false);


export interface pressedType {
  shade: boolean;
  signin: boolean;
  signup: boolean;
  isSignedin: boolean;
  setShade: (shade: boolean) => void;
  setSignin: (signin: boolean) => void;
  setSignup: (signup: boolean) => void;
  setIsSignedin: (isSignedin: boolean) => void;
}

// AppContext の生成
export const Pressed = createContext<pressedType>({
  shade: false,
  signin: false,
  signup: false,
  isSignedin: false,
  setShade: (shade: boolean) => {},
  setSignin: (signin: boolean) => {},
  setSignup: (signup: boolean) => {},
  setIsSignedin: (isSignedin: boolean) => {},
});

// AppContext にセッター関数を登録するためのコンポーネント
export const PressedProvider: React.FC<{ children: any}> = ({children}) => {
  // デフォルト値の取得用
  const context: pressedType = useContext(Pressed);

  // ステートオブジェクト作成
  const [shade, setShade] = useState(context.shade);
  const [signin, setSignin] = useState(context.signin);
  const [signup, setSignup] = useState(context.signup);
  const [isSignedin, setIsSignedin] = useState(context.isSignedin);

  // 下位コンポーネントへ渡す Context
  const newContext: pressedType = {
    shade, setShade, signin, setSignin, signup, setSignup, isSignedin, setIsSignedin
  };

  return (
    <Pressed.Provider value={newContext}>
      {children}
    </Pressed.Provider>
  );
};
