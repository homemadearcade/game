import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useCookies } from 'react-cookie'
import Login from "./Login.jsx";

if (global.location.origin.indexOf('localhost') > 0) {
  global.socket = io.connect('http://localhost:4000');
} else {
  global.socket = io.connect();
}

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const [state, setState] = useState({ email: '', password: '', message: '', checkingCookie: !!cookies.user});

  useEffect(() => {
    if(cookies.user && !global.user) {
      global.socket.emit("authentication", {})
    }
  }, [])

  global.socket.on("authenticated", ({cookie, user}) => {
    // for some reason this gets called a couple times even when user is false..
    if (user && !global.user) {
      setCookie('user', cookie, { path: '/' });
      global.user = user;
      setState({...state, checkingCookie: false});
      PAGE.userIdentified()
    }

    global.clearUserCookie = () => {
      removeCookie("user");
      global.user = null
      setState({...state, checkingCookie: true});
    }

    global.getUserCookie = () => {
      return cookies.user
    }
  });

  global.socket.on("auth_message", ({ message }) => {
    setState({...state, message, checkingCookie: false})
  });

  const onLogIn = () => {
    global.socket.emit("authentication", {email: state.email, password: state.password});
  };

  const onSignUp = () => {
    global.socket.emit("authentication", { email: state.email, password: state.password, signup: true });
  };

  const onForgotPassword = () => {
    global.socket.emit("authentication", { email: state.email, forgotPassword: true });
  };

  const onChange = e => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  if (global.user) {
    return null
  }

  if (!state.checkingCookie) {
    return (
      <Login actions={{
        onLogIn,
        onSignUp,
        onChange,
        onForgotPassword
      }} values={state} />
    )
  }

  return null
}

export default App;
