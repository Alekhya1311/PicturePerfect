import { Component } from "react";
import { Navigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import "./signup.css";
import logo from "../../Images/picturePerfect.jpg";
import { Button } from "@mui/material";
import Footer from "../Footer/Footer";
class SignupForm extends Component {
  state = {
    name: "",
    email: "",
    username: "",
    password: "",
    dob: "",
    phone: "",
    error: "",
    redirectToReferrer: false,
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleLogin = () => {
    window.location.href = "/login";
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, username, password, dob, phone } = this.state;
    try {
      const response = await fetch("http://127.0.0.1:8000/register_user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          username,
          password,
          dob,
          phonenum: phone,
          about: "",
          usertype: "general",
          userpic: "",
        }),
      });
      const { isRegistered, status, message } = await response.json();
      if (status === "SUCCESS" && isRegistered) {
        Cookies.set("username", username);
        this.setState({ redirectToReferrer: true });
      } else {
        this.setState({ redirectToReferrer: false, error: message });
      }
    } catch (error) {
      console.log(error);
      this.setState({
        error: "Unable to create account. Please try again later.",
      });
    }
  };

  render() {
    const {
      name,
      email,
      username,
      password,
      dob,
      phone,
      error,
      redirectToReferrer,
    } = this.state;

    if (redirectToReferrer === true) {
      return <Navigate to="/" />;
    }

    return (
      <div className="box">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo-img" />
          <p>Your creativity has found a home</p>
        </div>
        <div className="signup-container">
          <form className="signup-form" onSubmit={this.handleSubmit}>
            <h2>Signup</h2>

            <div className="signup-form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={this.handleInputChange}
              />
            </div>
            <div className="signup-form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={this.handleInputChange}
              />
            </div>
            <div className="signup-form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={this.handleInputChange}
              />
            </div>
            <div className="signup-form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={this.handleInputChange}
              />
            </div>
            <div className="signup-form-group">
              <label htmlFor="dob">Date of Birth</label>
              <input
                className="dob"
                type="date"
                id="dob"
                name="dob"
                value={dob}
                onChange={this.handleInputChange}
              />
            </div>
            <div className="signup-form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={phone}
                onChange={this.handleInputChange}
              />
            </div>
            <div className="buttons">
              <button onClick={this.handleSubmit}>Create Account</button>
            </div>
            <div className="already-member">
              <div className="account">
                <h4>Already a member?</h4>
              </div>
              <button
                style={{ fontSize: "14px", width: "80px" }}
                className="login-button"
                onClick={this.handleLogin}
              >
                Login
              </button>
              <div></div>
            </div>
            {error && <div className="error">{error}</div>}
          </form>
        </div>
      </div>
    );
  }
}

export default SignupForm;
