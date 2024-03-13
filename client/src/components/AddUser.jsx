import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";

function AddUser() {
     const [name, setName] = useState();
     const [email, setEmail] = useState();
     const [userCategory, setUserCategory] = useState([]);
     const [password, setPassword] = useState();
     const [allCategories, setAllCategories] = useState([]);

     const role = "supervisor";
     const UserId = localStorage.getItem("email");
     const handleCheckboxChange = (category) => {
       setUserCategory((prevCategories) => {
         const updatedCategories = prevCategories.includes(category)
           ? prevCategories.filter((c) => c !== category)
           : [...prevCategories, category];

         return updatedCategories;
       });
     };
     const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ name, email, password, role, userCategory });
        axios
          .post(
            `http://localhost:5001/api/user/createuser/${UserId}`,
            { name, email, password, role, userCategory },
            {
              headers: {
                "Authorization": `Bearer ${import.meta.env.VITE_API_KEY}`,
                "Content-Type": "application/json",
              },
            }
          )
          .then((res) => {
            console.log(res.data);
            window.location.reload();
          })
          .catch((err) => console.log(err));
     }
     useEffect(() => {
       // Fetch categories here
       axios
         .get("http://localhost:5001/api/categories/getcategory/" + UserId, {
           headers: {
             Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
             "Content-Type": "application/json",
           },
         })
         .then((response) => {
           setAllCategories(response.data);
         })
         .catch((error) => console.log(error));
     }, [UserId]);

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="my-5 d-flex justify-content-between">
          <h1>Add User</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <label htmlFor="exampleInputCategory1" className="form-label">
            Choose Category :
          </label>
          {allCategories.map((category) => (
            <label key={category._id} className="mx-3">
              <input
                type="checkbox"
                value={category.category}
                checked={userCategory.includes(category.category)}
                onChange={() => handleCheckboxChange(category.category)}
                className="mx-2"
              />
              {category.category}
            </label>
          ))}
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
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
export default AddUser;
