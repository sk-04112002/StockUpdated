import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import deleteicon from "../assets/deleteicon.png";
import update from "../assets/update.png";
function Categories(){
    const [category, setCategory] = useState("");
    const [subCategory, setSubCategory] = useState([]);
    const [allCategory, setAllCategory] = useState([]);
    const [catId, setCatId] = useState("");
    const [updateCategory, setUpdateCategory] = useState(false);
    const [updatedCategory, setUpdatedCategory] = useState("");
    const [updatedSubCategory, setUpdatedSubCategory] = useState([]);
    const UserId = localStorage.getItem("email");
    const handleSubmit = (e) => {
        e.preventDefault();
        const subCategoriesArray = subCategory
          .split(",")
          .map((subcategory) => subcategory.trim());

        axios
          .post(
            `http://localhost:5001/api/categories/addcategory/${UserId}`,
            { category, subCategory: subCategoriesArray },
            {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
                "Content-Type": "application/json",
              },
            }
          )
          .then((res) => {
            window.location.reload();
            console.log(res)
          })
          .catch((err) => console.log(err));
    }

    const handlegetAllCategories = () => {
        axios.get(
          `http://localhost:5001/api/categories/getallcategories/${UserId}`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        ).then((res) => {
            console.log(res.data);
            setAllCategory(res.data);
        }).catch(err => console.log(err)); 
    }

    const handleDelete = (id) => {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete the category?"
      );
        if(confirmDelete){
          axios
            .delete(
              `http://localhost:5001/api/categories/deletecategory/${id}`,
              {
                headers: {
                  Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
                  "Content-Type": "application/json",
                },
              }
            )
            .then((res) => {
              console.log(res);
              window.location.reload();
            })
            .catch((err) => console.log(err));
        }
    }

    const handleUpdate = (id) => {
        setCatId(id);
        setUpdateCategory(true);
        
    }

    const handleUpdateCategory = () => {
        setUpdateCategory(false);
        const updatedSubCategoriesArray = updatedSubCategory
          .split(",")
          .map((subcategory) => subcategory.trim());
        axios.put(
          `http://localhost:5001/api/categories/updatecategory/${catId}`,
          { updatedCategory, updatedSubCategory: updatedSubCategoriesArray },
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        ).then((res) => {
            console.log(res);
            window.location.reload();
        }).catch(err => console.log(err)); 
    }

    const showCategory = () => {
        axios.get(
          `http://localhost:5001/api/categories/getcategorybyid/${catId}`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        ).then((res) => {
            console.log(res.data);
            setUpdatedCategory(res.data.category);
            setUpdatedSubCategory(res.data.subCategories);
        }).catch(err => console.log(err));
    }

    useEffect(()=>{
        handlegetAllCategories();
        if(updateCategory){
            showCategory();
        }
    },[updateCategory])
    return (
      <div>
        <Navbar />
        <div className="container">
          <h4 className="my-4">Add Categories,</h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="category" className="form-label">
                Category :
              </label>
              <input
                type="text"
                className="form-control"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="subcategory" className="form-label">
                Sub Categories : (add subCategories separated by commas " , ")
              </label>
              <input
                type="text"
                className="form-control"
                id="subcategory"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Add Category
            </button>
          </form>
          <div className="row">
            <div className="my-5 col-lg-8">
              <h4>Your Categories,</h4>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Category</th>
                    <th scope="col">Sub Categories</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allCategory.map((categories, index) => {
                    return (
                      <tr key={index}>
                        <td>{categories.category}</td>
                        <td>{categories.subCategories.join(", ")}</td>
                        <td>
                          <img
                            src={update}
                            alt="update"
                            className="pr-3"
                            style={{ height: "20px", cursor: "pointer" }}
                            onClick={(e) => handleUpdate(categories._id)}
                          />
                          <img
                            src={deleteicon}
                            alt="delete"
                            className="px-3"
                            style={{ height: "20px", cursor: "pointer" }}
                            onClick={(e) => handleDelete(categories._id)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="my-5 col-lg-4">
              {updateCategory && (
                <div className="container">
                  <h4 className="my-4">Update Categories,</h4>
                  <form onSubmit={handleUpdateCategory}>
                    <div className="mb-3">
                      <label htmlFor="updatecategory" className="form-label">
                        Category :
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="updatecategory"
                        value={updatedCategory}
                        onChange={(e) => setUpdatedCategory(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="updatesubcategory" className="form-label">
                        Sub Categories : (add subCategories separated by commas
                        " , ")
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="updatesubcategory"
                        value={updatedSubCategory}
                        onChange={(e) => setUpdatedSubCategory(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary my-3">
                      Update Category
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
}
export default Categories;