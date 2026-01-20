import React from "react";
import "./SignIn.css";

export default function SignIn() {
  return (
    <div className="signin-wrapper">
      <div className="signin-card">
        <h1>Welcome Back</h1>
        <p className="subtitle">Sign in to your account</p>

        <div className="field">
          <label>Email</label>
          <input type="email" placeholder="you@example.com" />
        </div>

        <div className="field">
          <label>Password</label>
          <input type="password" placeholder="••••••••" />
        </div>

        <div className="extra">
          <span className="remember">
            <input type="checkbox" /> Remember me
          </span>
          <span className="forgot">Forgot password?</span>
        </div>

        <button className="signin-btn">Sign In</button>

        <p className="signup-link">
          Don’t have an account? <span>Sign Up</span>
        </p>
      </div>
    </div>
  );
}
