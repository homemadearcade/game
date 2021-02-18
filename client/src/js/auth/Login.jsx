import React from "react";
import Hastartscreen from '../playerUI/hastartscreen.jsx'
import TitleAnimation from '../playerUI/TitleAnimation.jsx'

// <button onClick={actions.onSignUp} color="violet" size="large">
//   Sign Up
// </button>
const Login = ({ values, actions }) => (
  <div className="PlayerUI">
  <div className="Cutscene Cutscene--stars">
  <Hastartscreen>
    <div className="Cutscene__game-title-over Cutscene__game-title-over--ha"><TitleAnimation onComplete={() => {}} style="sunny mornings" font={{fontFamily: "'Press Start 2P', sans-serif"}} title="Homemade Arcade"></TitleAnimation></div>
      <div className="Cutscene__games-container Cutscene__games-container--title">

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
      className="Cutscene__games-container__login-button"
      onClick={actions.onSignUp} size="large">
        Sign Up
      </button>
      <button
      className="Cutscene__games-container__login-button"
      onClick={actions.onForgotPassword} size="large">
        Send Reset Password Email
      </button>
      <div>{values.message}</div>
    </div>
  </Hastartscreen>
  </div>
  </div>
);

export default Login;
