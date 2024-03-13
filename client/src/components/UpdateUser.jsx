import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
function UpdateUser(){
    const { id } = useParams();
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [userCategory, setUserCategory] = useState([]);
    const [password, setPassword] = useState();
    const [role, setRole] = useState();
    const [allCategories, setAllCategories] = useState([]);

    const UserId = localStorage.getItem("email");

     const handleCheckboxChange = (category) => {
       setUserCategory((prevCategories) => {
         const updatedCategories = prevCategories.includes(category)
           ? prevCategories.filter((c) => c !== category)
           : [...prevCategories, category];

         return updatedCategories;
       });
     };
    
    axios.defaults.withCredentials = true;
    const handleGetUser = (e) => {
      axios
        .get(`http://localhost:5001/api/user/getuserinfo/${id}`, {
          headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_API_KEY}`,
            "Content-Type": "application/json",
          },
        })
        .then((result) => {
          console.log(result);
          setName(result.data.name);
          setEmail(result.data.email);
          setPassword(result.data.password);
          setRole(result.data.role);
          setUserCategory(result.data.userCategory);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    useEffect(() => {
      handleGetUser();
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
    }, []);
    const navigate = useNavigate();

    const handleUpdateUser = (e) => {
      e.preventDefault();
      console.log("Data to be sent:", {
        name,
        email,
        password,
        role,
        userCategory,
      });
      axios
        .put(
          `http://localhost:5001/api/user/updateuserinfo/${id}`,
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
          navigate("/ShowUsers");
        })
        .catch((error) => {
          console.log(error);
        });
    };
    return (
      <div>
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
          <form
            className="shadow p-5"
            style={{ borderRadius: "15px" }}
            onSubmit={handleUpdateUser}
          >
            <h3 className="text-center mb-5">Update User</h3>
            <div className="mb-3">
              <label for="exampleInputEmail1" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="exampleInputName1"
                aria-describedby="emailHelp"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label for="exampleInputEmail1" className="form-label">
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              <label for="exampleInputPassword1" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label for="exampleInputEmail1" className="form-label">
                Role
              </label>
              <input
                type="text"
                className="form-control"
                id="exampleInputRole1"
                aria-describedby="emailHelp"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Update
            </button>
          </form>
        </div>
      </div>
    );
}
export default UpdateUser;