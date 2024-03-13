import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import update from "../assets/update.png";
import deleteicon from "../assets/deleteicon.png";
import Navbar from "./Navbar";
function OutOfStock() {
  const [productData, setProductData] = useState([]);
  axios.defaults.withCredentials = true;
  const UserId = localStorage.getItem("email");
  useEffect(() => {
    axios
      .get(`http://localhost:5001/api/products/getproducts/${UserId}`, {
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_API_KEY}`,
          "Content-Type": "application/json",
        },
      })
      .then((result) => {
        setProductData(result.data);
      })
      .catch((err) => console.log(err));
  }, []);
  const OutOfStockProducts = productData.filter(
    (obj) => obj.productQuantity === 0 
  );
  return (
    <div>
      <Navbar/>
      <div className="container">
        <div className="d-flex justify-content-between">
          <h1 className="my-5">Out of Stock Products</h1>
          
        </div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Product Image</th>
              <th scope="col">Product Brand</th>
              <th scope="col">Product Name</th>
              <th scope="col">Category</th>
              <th scope="col">Quantity</th>
              <th scope="col">Price</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {OutOfStockProducts.map((product) => {
              return (
                <tr>
                  <td>
                    <img
                      src={product.productImage}
                      alt="Product Image"
                      style={{
                        height: "80px",
                        width: "80px",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                  </td>
                  <td>{product.productBrand}</td>
                  <td>{product.productName}</td>
                  <td>{product.productCategory}</td>
                  <td>{product.productQuantity}</td>
                  <td>{product.productPrice}</td>
                  <td>
                    <Link to={`/UpdateProducts/${product._id}`}>
                      <img
                        src={update}
                        alt="update"
                        className="px-3"
                        style={{ height: "20px" }}
                      />
                    </Link>
                    <img
                      src={deleteicon}
                      alt="delete"
                      style={{ height: "20px", cursor: "pointer" }}
                      onClick={(e) => handleDelete(product._id)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default OutOfStock;
