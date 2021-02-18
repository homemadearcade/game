import React, { useState, useEffect } from "react";
import Hastartscreen from '../playerUI/hastartscreen.jsx'
import TitleAnimation from '../playerUI/TitleAnimation.jsx'

// <button onClick={actions.onSignUp} color="violet" size="large">
//   Sign Up
// </button>

const Login = ({ values, actions }) => {
  const [state, setState] = useState({ signup: false, resetPassword: false });

  let form

  if(state.resetPassword) {
    form = <div>
      <input
        className="Cutscene__games-container__login-input"
        name="email"
        placeholder="Email"
        value={values.email}
        onChange={actions.onChange}
      />
      <button
      className="Cutscene__games-container__login-button"
      onClick={actions.onForgotPassword} size="large">
        Send Reset Password Email
      </button>
    </div>
  } else if(state.signup) {
    form = <div>
      <input
        className="Cutscene__games-container__login-input"
        name="firstname"
        placeholder="First Name"
        value={values.firstname}
        onChange={actions.onChange}
      />
      <input
        className="Cutscene__games-container__login-input"
        name="lastname"
        placeholder="Last Name"
        value={values.lastname}
        onChange={actions.onChange}
      />
      <input
        className="Cutscene__games-container__login-input"
        name="email"
        placeholder="Email"
        value={values.email}
        onChange={actions.onChange}
      />
      <input
        className="Cutscene__games-container__login-input"
        name="password"
        placeholder="Password"
        type="password"
        value={values.password}
        onChange={actions.onChange}
      />
      <button
      className="Cutscene__games-container__login-button"
      onClick={actions.onSignUp} size="large">
        Sign Up
      </button>
    </div>
  } else if(PAGE.getParameterByName('resetPasswordToken')) {
    form = <div>
      <input
        className="Cutscene__games-container__login-input"
        name="password"
        placeholder="Password"
        type="password"
        value={values.password}
        onChange={actions.onChange}
      />
      <input
        className="Cutscene__games-container__login-input"
        name="retypepassword"
        placeholder="Retype password"
        type="password"
        value={values.retypepassword}
        onChange={actions.onChange}
      />
      <button
      className="Cutscene__games-container__login-button"
      onClick={actions.onResetPassword} size="large">
        Reset Password
      </button>
    </div>
  } else {
    form = <div>
      <input
        className="Cutscene__games-container__login-input"
        name="email"
        placeholder="Email"
        value={values.email}
        onChange={actions.onChange}
      />
      <input
        className="Cutscene__games-container__login-input"
        name="password"
        placeholder="Password"
        type="password"
        value={values.password}
        onChange={actions.onChange}
      />
      <button
      className="Cutscene__games-container__login-button"
      onClick={actions.onLogIn} size="large">
        Log In
      </button>
      <button
      className="Cutscene__games-container__login-link"
      onClick={() => {
        setState({...state, signup: true})
      }} size="large">
        Sign Up
      </button>
      <button
      className="Cutscene__games-container__login-link"
      onClick={() => {
        setState({...state, resetPassword: true})
      }} size="large">
        Forgot Password?
      </button>
    </div>
  }

  return <div className="PlayerUI">
    <div className="Cutscene Cutscene--stars">
      <Hastartscreen>
        <div className="Cutscene__game-title-over Cutscene__game-title-over--ha"><TitleAnimation onComplete={() => {}} style="sunny mornings" font={{fontFamily: "'Press Start 2P', sans-serif"}} title="Homemade Arcade"></TitleAnimation></div>
        <div className="Cutscene__games-container Cutscene__games-container--title">
          {form}
          <div
          className="Cutscene__games-container__login-message"

          >{values.message}</div>
        </div>
      </Hastartscreen>
    </div>
  </div>
};

export default Login;
