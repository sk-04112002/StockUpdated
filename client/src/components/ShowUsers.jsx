import React, { useEffect } from "react";
import { useState } from "react";
import deleteicon from "../assets/deleteicon.png"
import axios from "axios"
import { Link } from "react-router-dom";
import update from "/Users/Lenovo/OneDrive/Desktop/stock/client/src/assets/update.png"
import Navbar from "./Navbar";
function ShowUsers(){
    const [user, setUser] = useState([]);
    const [Category, setCategory] = useState([]);
    const [SubCategory, setSubCategory] = useState([]);
    const [cat, setCat] = useState("");
    const [subCat, setSubCat] = useState("");
    axios.defaults.withCredentials = true;
    const UserId = localStorage.getItem("email");
    useEffect(() => {
        axios
          .get(
            `http://localhost:5001/api/user/getuserdetails/${UserId}?userCategory=${cat}`,
            {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
                "Content-Type": "application/json",
              },
            }
          )
          .then((res) => {
            console.log(res.data);
            setUser(res.data);
          })
          .catch((err) => console.log(err));
          handleCategory();
          handleSubCategory();
          handleSubCat();
    },[cat,subCat])

    const handleClearFilter = () => {
      setSubCat("");
      setCat("");
    }

    const handleCategory = () => {
      axios
        .get("http://localhost:5001/api/categories/getcategory/" + UserId, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setCategory(response.data);
        })
        .catch((error) => console.log(error));
    }

    const handleSubCategory = () => {
      axios
        .get("http://localhost:5001/api/categories/getallsubcategories/" + UserId, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("Sub Cat : "+response.data);
          setSubCategory(response.data);
        })
        .catch((error) => console.log(error));
    };

    const UserDetails = user.filter(
      (obj) => obj.email !== UserId
    );

    const handleDelete = (id) => {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete the supervisor?"
      );
      if(confirmDelete){
        axios
          .delete(`http://localhost:5001/api/user/deleteuser/${id}`, {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            console.log(res);
            window.location.reload();
          })
          .catch((err) => console.log(err));
      }
        
    }

    const handleSubCat = () => {
      axios.get("http://localhost:5001/api/categories/getspecificcategory/" + subCat, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }).then((res) => {
        console.log(`Category for selected sub category ${subCat} is ${res.data} `);
        setCat(res.data);
      })
    }
    return (
      <div>
        <Navbar />
        <div className="container my-5">
          <div className="d-flex justify-content-between">
            <h1>Your Users,</h1>
          </div>
          <div className="row">
            <div className="col-md-10">
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">User Id</th>
                    <th scope="col">User Name</th>
                    <th scope="col">User Email</th>
                    <th scope="col">User Role</th>
                    <th scope="col">Categories</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {UserDetails.map((user) => {
                    return (
                      <tr>
                        <td>{user._id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>{user.userCategory.join(", ")}</td>
                        <td>
                          <Link to={`/UpdateUser/${user._id}`}>
                            <img
                              src={update}
                              alt="update"
                              style={{ height: "20px", cursor: "pointer" }}
                            />
                          </Link>
                          <img
                            src={deleteicon}
                            alt="delete"
                            style={{ height: "20px", cursor: "pointer" }}
                            onClick={(e) => handleDelete(user._id)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="col-md-2">
              <h6>Filter User by Category & SubCategory :</h6>
              <form onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="category">Choose a Category :</label>
                <select
                  id="category"
                  name="category"
                  className="m-3 px-5 py-2"
                  value={cat}
                  onChange={(e) => setCat(e.target.value)}
                >
                  <option value="">All</option>
                  {Category.map((categories) => {
                    return (
                      <option key={categories._id} value={categories.category}>
                        {categories.category}
                      </option>
                    );
                  })}
                </select>
                <label htmlFor="category">Choose a Sub Category :</label>
                <select
                  id="subcategory"
                  name="subcategory"
                  className="m-3 px-5 py-2"
                  value={subCat}
                  onChange={(e) => {
                    handleSubCat();
                    setSubCat(e.target.value);
                  }}
                >
                  <option value="">All</option>
                  {SubCategory.map((categories, index) => {
                    return (
                      <option key={index} value={categories}>
                        {categories}
                      </option>
                    );
                  })}
                </select>
                <button
                  type="button"
                  className="btn btn-danger my-3 mx-3"
                  onClick={handleClearFilter}
                >
                  Clear
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
}
export default ShowUsers;