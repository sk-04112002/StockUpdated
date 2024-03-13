import React from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from './Navbar.jsx';
function ShowProduct(){
  const {id} = useParams();
  axios.defaults.withCredentials = true;
  const [productImage, setProductImage] = useState(null);
  const [productId, setProductId] = useState("");
  const [productBrand, setProductBrand] = useState("");
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("Electronics");
  const [productSubCategory, setProductSubCategory] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [productMinQuantity, setProductMinQuantity] = useState("");
  const [productMaxQuantity, setProductMaxQuantity] = useState("");
  const [productColour, setProductColour] = useState("");
  const [productSize, setProductSize] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productAdminId, setProductAdminId] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`http://localhost:5001/api/products/getproductsinfo/${id}`, {
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_API_KEY}`,
          "Content-Type": "application/json",
        },
      })
      .then((result) => {
        console.log(result);
        setProductImage(result.data.productImage);
        setProductId(result.data._id);
        setProductBrand(result.data.productBrand);
        setProductName(result.data.productName);
        setProductCategory(result.data.productCategory);
        setProductSubCategory(result.data.productSubCategory);
        setProductQuantity(result.data.productQuantity);
        setProductMinQuantity(result.data.productMinQuantity);
        setProductMaxQuantity(result.data.productMaxQuantity);
        setProductColour(result.data.productColour);
        setProductSize(result.data.productSize);
        setProductPrice(result.data.productPrice);
        setProductAdminId(result.data.adminid);
        setProductDescription(result.data.productDescription);
      })
      .catch((error) => {
        console.log(error);
      });
  },[])
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5001/api/products/deleteproduct/${id}`, {
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_API_KEY}`,
          "Content-Type": "application/json",
        },
      })
      .then((result) => {
        console.log(result);
        navigate("/landing");
      })
      .catch((err) => console.log(err));
  };
    return (
      <div>
        <Navbar/>
        <div className="container">
          <div className="d-flex justify-content-between my-5">
            <h1>Product Details</h1>
          </div>
          <div className="row align-items-center shadow">
            <div className="col-md-4">
              <img src={productImage} alt="productImage" />
            </div>
            <div className="col-md-8">
              <h3 style={{ fontWeight: "700" }} className="my-3">
                {productName}
              </h3>
              <div className="d-flex my-3">
                <h5 style={{ fontWeight: "700" }}>Product ID : </h5>
                <h5 className="mx-2">{productId}</h5>
              </div>
              <div className="d-flex my-3">
                <h5 style={{ fontWeight: "700" }}>Brand : </h5>
                <h5 className="mx-2">{productBrand}</h5>
              </div>
              <div className="d-flex my-3">
                <h5 style={{ fontWeight: "700" }}>Product Name : </h5>
                <h5 className="mx-2">{productName}</h5>
              </div>
              <div className="d-flex my-3">
                <h5 style={{ fontWeight: "700" }}>Product Category : </h5>
                <h5 className="mx-2">{productCategory}</h5>
              </div>
              <div className="d-flex my-3">
                <h5 style={{ fontWeight: "700" }}>Product Sub Category : </h5>
                <h5 className="mx-2">{productSubCategory}</h5>
              </div>
              <div className="d-flex my-3">
                <h5 style={{ fontWeight: "700" }}>Product Quantity : </h5>
                <h5 className="mx-2">{productQuantity}</h5>
              </div>
              <div className="d-flex my-3">
                <h5 style={{ fontWeight: "700" }}>
                  Product Minimum Quantity :
                </h5>
                <h5 className="mx-2">{productMinQuantity}</h5>
              </div>
              <div className="d-flex my-3">
                <h5 style={{ fontWeight: "700" }}>
                  Product Maximum Quantity :
                </h5>
                <h5 className="mx-2">{productMaxQuantity}</h5>
              </div>
              <div className="d-flex my-3">
                <h5 style={{ fontWeight: "700" }}>
                  Product Colour :
                </h5>
                <h5 className="mx-2">{productColour}</h5>
              </div>
              <div className="d-flex my-3">
                <h5 style={{ fontWeight: "700" }}>
                  Product Size :
                </h5>
                <h5 className="mx-2">{productSize}</h5>
              </div>
              <div className="d-flex my-3">
                <h5 style={{ fontWeight: "700" }}>Product Price : </h5>
                <h5 className="mx-2">{productPrice}</h5>
              </div>
              <div className="d-flex my-3">
                <h5 style={{ fontWeight: "700" }}>Product Admin ID : </h5>
                <h5 className="mx-2">{productAdminId}</h5>
              </div>
              <div className="d-flex my-3">
                <h5 style={{ fontWeight: "700" }}>Product Description : </h5>
                <h5 className="mx-2">{productDescription}</h5>
              </div>
              <div className="d-flex my-3">
                <Link to={`/UpdateProducts/${productId}`}>
                  <button type="button" className="btn btn-primary mr-3">
                    Update
                  </button>
                </Link>
                <button
                  type="button"
                  className="btn btn-danger mx-3"
                  onClick={(e) => handleDelete(productId)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
export default ShowProduct;