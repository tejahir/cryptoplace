import React from "react";
import "./SignUp.css";

export default function SignUp() {
  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        <h1>Create Account</h1>
        <p className="subtitle">Sign up to get started</p>

        <div className="field">
          <label>Full Name</label>
          <input type="text" placeholder="John Doe" />
        </div>

        <div className="field">
          <label>Email</label>
          <input type="email" placeholder="you@example.com" />
        </div>

        <div className="field">
          <label>Password</label>
          <input type="password" placeholder="••••••••" />
        </div>

        <div className="field">
          <label>Confirm Password</label>
          <input type="password" placeholder="••••••••" />
        </div>

        <button className="signup-btn">Sign Up</button>

        <p className="login-link">
          Already have an account? <span>Sign In</span>
        </p>
      </div>
    </div>
  );
}
