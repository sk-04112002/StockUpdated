import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/warehouse.png";
function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:5001/api/user/login",
        { email, password },
        {
          headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((result) => {
        console.log(result);
        if (result.data === "Login Successfull !") {
          navigate("/UserDashboard");
        }
      })
      .catch((error) => {
        if (error.response) {
          // The request was made, but the server responded with a non-2xx status code
          console.error("Server responded with an error:", error.response.data);
        } else if (error.request) {
          // The request was made, but no response was received
          console.error("No response received from the server");
        } else {
          // Something happened in setting up the request that triggered an error
          console.error("Error setting up the request:", error.message);
        }
      });
  };
  useEffect(() => {
    localStorage.setItem("email", email);
  }, [email]);
  return (
    <div className="container">
      <div className="d-flex">
        <img
          src={logo}
          alt="logo"
          style={{ height: "40px", width: "40px" }}
          className="my-3"
        />
        <h3 className="mx-2 my-4">Stock Management App</h3>
      </div>
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="row" style={{ maxWidth: "550px" }}>
          <div className="col shadow p-5" style={{ borderRadius: "15px" }}>
            <form className="mx-auto" onSubmit={handleSubmit}>
              <h1 className="text-center mb-3">Login</h1>
              <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div id="emailHelp" className="form-text"></div>
              </div>
              <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="exampleInputPassword1"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="d-flex justify-content-between">
                <button className="btn btn-primary mb-3">Login</button>
                <Link to="/ForgotPassword">Forgot Password</Link>
              </div>

              <p>
                Don't have an account? <Link to="/signup">Signup</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;
