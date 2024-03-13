import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

function AddProducts() {
  const [userName, setUserName] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [productBrand, setProductBrand] = useState("");
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [category, setCategory] = useState([]);
  axios.defaults.withCredentials = true;
  const UserId = localStorage.getItem("email");
  const handleImage = (e) => {
    {
       var reader = new FileReader();
       reader.readAsDataURL(e.target.files[0]);
       reader.onload = () => {
          console.log(reader.result)
          setProductImage(reader.result)
       };
       reader.onerror = (err) => {
           console.log(err);
       }           
   }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    axios
      .post(
        `http://localhost:5001/api/products/${UserId}`,
        {
          productImage,
          productBrand,
          productName,
          productCategory,
          productPrice,
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
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const handleGetCategory = () =>{
    axios.get(`http://localhost:5001/api/categories/getcategory/${UserId}`, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
        "Content-Type": "application/json",
      },
    }).then((response) => {
      console.log(response.data);
      setCategory(response.data);
    }).catch((error) => console.log(error));
  }
  const handleUserName = () => {
    axios
      .get(`http://localhost:5001/api/user/getuser/${UserId}`, {
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_API_KEY}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);
        setUserName(response.data);
      })
      .catch((err) => console.log(err));
  }
  useEffect(() => {
    handleUserName();
    handleGetCategory();
  },[])
  
  return (
    <div>
      <Navbar />
      <div className="container my-5">
        <div className="d-flex justify-content-between">
          <h1>Hi, {userName.name}!</h1>
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="productImage" className="form-label">
                Product Image
              </label>
              <input
                type="file"
                className="form-control"
                id="productImage"
                onChange={handleImage}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="productName" className="form-label">
                Product Brand
              </label>
              <input
                type="text"
                className="form-control"
                id="productBrand"
                value={productBrand}
                onChange={(e) => setProductBrand(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="productName" className="form-label">
                Product Name
              </label>
              <input
                type="text"
                className="form-control"
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </div>
            <label htmlFor="category">Choose a Category :</label>
            <select
              id="category"
              name="category"
              className="mx-3 px-5 py-2"
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
              required
            >
              <option value="">All</option>
              {category.map((categories) => {
                return(
                  <option key ={categories._id} value={categories.category}>{categories.category}</option>
                )
                
              })}
            </select>
            <div className="mb-3">
              <label htmlFor="productPrice" className="form-label">
                Price
              </label>
              <input
                type="number"
                className="form-control"
                id="productPrice"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Add Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProducts;
