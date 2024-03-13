import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import update from "../assets/update.png"
import deleteicon from "../assets/deleteicon.png"
import eye from "../assets/eye.png"
import Navbar from "./Navbar";
function NeedUpdation(){
    const [productData, setProductData] = useState([]);
    const UserId = localStorage.getItem("email");
    const handleProductCount = () => {
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
    };
    const notUpdatedProducts = productData.filter(
      (products) => !products.updateStatus
    );
    useEffect(() => {
      handleProductCount();
    }, []);
    return(
        <div>
          <Navbar/>
            <div className="container my-5">
                <h1>Need to Update,</h1>
                <div className="row">
          <div className="col table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Product Image</th>
                  <th scope="col">Product Brand</th>
                  <th scope="col">Product Name</th>
                  <th scope="col">Category</th>
                  <th scope="col">Sub Category</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Price</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {notUpdatedProducts.map((product) => {
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
                      <td>{product.productSubCategory}</td>
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
                        <Link to={`/ShowProduct/${product._id}`}>
                          <img
                            src={eye}
                            alt="show"
                            className="px-3"
                            style={{ height: "20px" }}
                          />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          </div>
            </div>
        </div>
    )
}
export default NeedUpdation