import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import close from "../assets/close.png"
import Navbar from "./Navbar";


function UserDashboard(){
    const [userName, setUserName] = useState("");
    const [role, setRole] = useState("");
    const [productData, setProductData] = useState([]);
    const [user, setUser] = useState([]);
    const [brand, setBrand] = useState(false);
    
    
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
    }
    const notUpdatedProducts = productData.filter((products) => !products.updateStatus);
    const uniqueBrandsSet = productData.reduce((brandsSet, product) => {
      brandsSet.add(product.productBrand);
      return brandsSet;
    }, new Set());

    // Convert the set back to an array
    const uniqueBrandsArray = Array.from(uniqueBrandsSet);
    const OverStockedProducts = productData.filter(
      (obj) => obj.productQuantity > obj.productMaxQuantity
    );
     const LowStockProducts = productData.filter(
       (obj) => obj.productQuantity < obj.productMinQuantity
     );
     const OutOfStockProducts = productData.filter(
       (obj) => obj.productQuantity === 0
     );
    const toggleBrand = () => {
      setBrand(!brand);
    }
    const handleUserCount = () => {
        axios
          .get(`http://localhost:5001/api/user/getuserdetails/${UserId}`, {
            headers: {
              "Authorization": `Bearer ${import.meta.env.VITE_API_KEY}`,
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            console.log(res.data);
            setUser(res.data);
          })
          .catch((err) => console.log(err));
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
    };
    const findRole = () => {
      axios
        .get(`http://localhost:5001/api/user/findrole/${UserId}`, {
          headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_API_KEY}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log(res.data);
          setRole(res.data.role);
        })
        .catch((err) => console.log(err));
    };
   
    useEffect(() => {
      handleUserName();
      findRole();
      handleProductCount();
      handleUserCount();
    }, []);
    let showUserDetail;
    if(role === "admin"){
      showUserDetail = (
        <div className="col-md-3 m-5">
          <Link to="/ShowUsers" style={{ textDecoration: "none" }}>
            <div
              className="text-center p-5"
              style={{
                backgroundColor: "#708d81",
                color: "white",
                borderRadius: "0.6rem",
              }}
            >
              <h3>Total Users Added </h3>
              <div>
                <h2>{user.length - 1}</h2>
              </div>
            </div>
          </Link>
        </div>
      );
    }else{
      showUserDetail = (<div></div>)
    }

    
    
    
    
    return (
      <div>
        <Navbar />
        {brand && (
          <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div
              className="p-5 text-center text-light bg-dark"
              style={{ borderRadius: "0.7rem" }}
            >
              <img
                src={close}
                alt="close"
                style={{ height: "25px", marginLeft: "98%", cursor: "pointer" }}
                onClick={toggleBrand}
              />
              <h4 style={{ fontWeight: "900", fontSize: "2.5rem" }}>Brands</h4>

              {uniqueBrandsArray.map((Brands, index) => (
                <h6
                  className="px-5 py-3"
                  style={{
                    fontWeight: "500",
                    fontSize: "2rem",
                    backgroundColor: "white",
                    color: "black",
                  }}
                  key={index}
                >
                  {Brands}
                </h6>
              ))}
            </div>
          </div>
        )}

        <div className="container my-4">
          <h4>Welcome {userName.name}!</h4>
          <h6>Role: {role}</h6>
          <h6>Email Address: {UserId}</h6>
          
        </div>
        <div className="container">
          <div className="row d-flex justify-content-center">
            {showUserDetail}
            <div className="col-md-3 m-5">
              <Link to="/landing" style={{ textDecoration: "none" }}>
                <div
                  className="text-center p-5"
                  style={{
                    backgroundColor: "#001427",
                    color: "white",
                    borderRadius: "0.6rem",
                  }}
                >
                  <h3>Total Products Added </h3>
                  <div>
                    <h2>{productData.length}</h2>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-md-3 m-5">
              <Link to="/NeedUpdation" style={{ textDecoration: "none" }}>
                <div
                  className="text-center p-5"
                  style={{
                    backgroundColor: "#f4d58d",
                    color: "white",
                    borderRadius: "0.6rem",
                  }}
                >
                  <h3>Need to be Updated </h3>
                  <div>
                    <h2>{notUpdatedProducts.length}</h2>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-md-3 m-5">
              <div
                className="text-center p-5"
                style={{
                  backgroundColor: "#bf0603",
                  color: "white",
                  borderRadius: "0.6rem",
                  cursor: "pointer",
                }}
                onClick={toggleBrand}
              >
                <h3>Number of Brands </h3>
                <div>
                  <h2>{uniqueBrandsArray.length}</h2>
                </div>
              </div>
            </div>

            <div className="col-md-3 m-5">
              <Link to="/OverStock" style={{ textDecoration: "none" }}>
                <div
                  className="text-center p-5"
                  style={{
                    backgroundColor: "#0fa3b1",
                    color: "white",
                    borderRadius: "0.6rem",
                  }}
                >
                  <h3>Over Stocked Products</h3>
                  <div>
                    <h2>{OverStockedProducts.length}</h2>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-md-3 m-5">
              <Link to="/LowStock" style={{ textDecoration: "none" }}>
                <div
                  className="text-center p-5"
                  style={{
                    backgroundColor: "#ffe45e",
                    color: "white",
                    borderRadius: "0.6rem",
                  }}
                >
                  <h3>Low Stock Products</h3>
                  <div>
                    <h2>{LowStockProducts.length}</h2>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-md-3 m-5">
              <Link to="/OutOfStock" style={{ textDecoration: "none" }}>
                <div
                  className="text-center p-5"
                  style={{
                    backgroundColor: "#ff7d00",
                    color: "white",
                    borderRadius: "0.6rem",
                  }}
                >
                  <h3>Out of Stock Products</h3>
                  <div>
                    <h2>{OutOfStockProducts.length}</h2>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
}
export default UserDashboard