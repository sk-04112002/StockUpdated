import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function ForgotPassword() {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        if(password === confirmPassword){
           axios
             .put(
               "http://localhost:5001/api/user/forgotpassword",
               {
                 email,
                 password,
               },
               {
                 headers: {
                   "Authorization": `Bearer ${import.meta.env.VITE_API_KEY}`,
                   "Content-Type": "application/json",
                 },
               }
             )
             .then((response) => {
               console.log(response);
               navigate("/");
             })
             .catch((err) => {
               console.log(err);
             });
        }else{
          console.log("Password and Confirm Password must be same.")
        }
       
    }
    return (
      <div>
        <div className="container">
          <div className="d-flex justify-content-center align-items-center min-vh-100">
            <form
              className="shadow p-5"
              style={{ borderRadius: "15px" }}
              onSubmit={handleSubmit}
            >
              <h1 className="mb-5">Forgot Password</h1>
              <div className="mb-3">
                <label for="exampleInputEmail1" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label for="exampleInputEmail1" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label for="exampleInputPassword1" className="form-label">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="exampleInputPassword1"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    );
}
export default ForgotPassword