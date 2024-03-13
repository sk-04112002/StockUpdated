import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/warehouse.png";
function Signup() {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [userCategory, setUserCategory] = useState([])

  const role = "admin";
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:5001/api/user/register",
        {
          name,
          email,
          password,
          role,
          userCategory,
        },
        {
          headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((result) => {
        console.log(result);
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

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
        <div className="row" style={{ maxWidth: "500px" }}>
          <div className="col shadow p-5" style={{ borderRadius: "15px" }}>
            <form className="mx-auto" onSubmit={handleSubmit}>
              <h1 className="text-center mb-3">Sign Up</h1>
              <div className="mb-3">
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputPassword1"
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
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
                <div id="emailHelp" className="form-text">
                  We'll never share your email with anyone else.
                </div>
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

              <button type="submit" className="btn btn-primary">
                Sign Up
              </button>
              <p>
                Already have an account? <Link to="/">Login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Signup;
