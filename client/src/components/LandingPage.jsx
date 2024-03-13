import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import update from "../assets/update.png";
import deleteicon from "../assets/deleteicon.png";
import eye from "../assets/eye.png";
import Navbar from "./Navbar";
function LandingPage() {
  const [productData, setProductData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productSubCategory, setProductSubCategory] = useState("");
  const [productBrand, setProductBrand] = useState("");
  const [productColour, setProductColour] = useState("");
  const [productSize, setProductSize] = useState("");

  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const UserId = localStorage.getItem("email");

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/landing", {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
          "Content-Type": "application/json",
        },
      })
      .then((result) => {
        console.log(result);
        if (
          result.data !== "Successfull" ||
          result.data === "Missing token" ||
          result.data === "Invalid token"
        ) {
          navigate("/");
        } else {
          axios
            .get(
              `http://localhost:5001/api/products/getproducts/${UserId}?productCategory=${productCategory}&productSubCategory=${productSubCategory}&productBrand=${productBrand}&productColour=${productColour}&productSize=${productSize}&sortBy=${sortBy}`,
              {
                headers: {
                  Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
                  "Content-Type": "application/json",
                },
              }
            )
            .then((result) => {
              setProductData(result.data);
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((error) => {
        if (error.response) {
          // The request was made, but the server responded with a non-2xx status code
          console.error("Server responded with an error:", error.response.data);
        } else if (error.request) {
          // The request was made, but no response was received
          console.error("No response received from the server");
        } else {
          // Something happened in setting up the request that triggered an error
          console.error("Error setting up the request:", error.message);
        }
      });
  }, [
    sortBy,
    productCategory,
    productSubCategory,
    productBrand,
    productColour,
    productSize,
  ]);
  

  const uniqueCategorySet = productData.reduce((brandsSet, product) => {
    brandsSet.add(product.productCategory);
    return brandsSet;
  }, new Set());

  const uniqueCategoryArray = Array.from(uniqueCategorySet);

  const uniqueSubSet = productData.reduce((brandsSet, product) => {
    brandsSet.add(product.productSubCategory);
    return brandsSet;
  }, new Set());

  const uniqueSubArray = Array.from(uniqueSubSet);

  const uniqueBrandSet = productData.reduce((brandsSet, product) => {
    brandsSet.add(product.productBrand);
    return brandsSet;
  }, new Set());

  const uniqueBrandArray = Array.from(uniqueBrandSet);

  const uniqueColourSet = productData.reduce((brandsSet, product) => {
    brandsSet.add(product.productColour);
    return brandsSet;
  }, new Set());

  const uniqueColourArray = Array.from(uniqueColourSet);

  const uniqueSizeSet = productData.reduce((brandsSet, product) => {
    brandsSet.add(product.productSize);
    return brandsSet;
  }, new Set());

  const uniqueSizeArray = Array.from(uniqueSizeSet);

  const filterProducts = (product) => {
    const {
      productName,
      productBrand,
      productCategory,
      productSubCategory,
      productPrice,
      productQuantity,
    } = product;
    const lowerCaseQuery = searchQuery.toLowerCase();

    return (
      productName.toLowerCase().includes(lowerCaseQuery) ||
      productBrand.toLowerCase().includes(lowerCaseQuery) ||
      productCategory.toLowerCase().includes(lowerCaseQuery) ||
      productSubCategory.toLowerCase().includes(lowerCaseQuery) ||
      productPrice.toString().includes(searchQuery) ||
      productQuantity.toString().includes(searchQuery)
    );
  };

  const filteredProductData = productData.filter(filterProducts);
  const handleClearFilter = () => {
    setProductCategory("");
    setProductSubCategory("");
    setProductColour("");
    setProductSize("");
    window.location.reload();
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete the product?"
    );
    if (confirmDelete) {
      axios
        .delete(`http://localhost:5001/api/products/deleteproduct/${id}`, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
            "Content-Type": "application/json",
          },
        })
        .then((result) => {
          console.log(result);
          window.location.reload();
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container my-5">
        <h1 className="mb-3">All Products,</h1>
        <form
          className="d-flex"
          role="search"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <h6 className="mx-3">Sort by:</h6>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2"
          >
            <option value="">Select...</option>
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="category">Category</option>
            <option value="brand">Brand</option>
            <option value="subcategory">Sub Category</option>
          </select>
        </form>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-10 table-responsive">
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
                {filteredProductData.map((product, index) => {
                  return (
                    <tr key={index}>
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
          <div className="col-md-2">
            <h6>Filters :</h6>
            <form onSubmit={(e) => e.preventDefault()}>
              
              <label htmlFor="category">Category :</label>
              {uniqueCategoryArray &&
                uniqueCategoryArray.map(
                  (subcategory) =>
                    subcategory &&
                    subcategory.trim() !== "" && (
                      <div key={subcategory} className="form-check">
                        <input
                          type="checkbox"
                          id={subcategory}
                          name={subcategory}
                          checked={productCategory.includes(subcategory)}
                          onChange={() => {
                            setProductCategory((prev) => {
                              if (prev.includes(subcategory)) {
                                return prev.filter(
                                  (item) => item !== subcategory
                                );
                              } else {
                                return [...prev, subcategory];
                              }
                            });
                          }}
                          className="form-check-input"
                        />
                        <label
                          htmlFor={subcategory}
                          className="form-check-label"
                        >
                          {subcategory}
                        </label>
                      </div>
                    )
                )}
              <div className="my-3">
                <label htmlFor="subcategory">Sub Category :</label>
                {uniqueSubArray &&
                  uniqueSubArray.map(
                    (subcategory) =>
                      subcategory &&
                      subcategory.trim() !== "" && (
                        <div key={subcategory} className="form-check">
                          <input
                            type="checkbox"
                            id={subcategory}
                            name={subcategory}
                            checked={productSubCategory.includes(subcategory)}
                            onChange={() => {
                              setProductSubCategory((prev) => {
                                if (prev.includes(subcategory)) {
                                  return prev.filter(
                                    (item) => item !== subcategory
                                  );
                                } else {
                                  return [...prev, subcategory];
                                }
                              });
                            }}
                            className="form-check-input"
                          />
                          <label
                            htmlFor={subcategory}
                            className="form-check-label"
                          >
                            {subcategory}
                          </label>
                        </div>
                      )
                  )}
              </div>
              <label htmlFor="brand">Brand :</label>
              {uniqueBrandArray &&
                uniqueBrandArray.map(
                  (brand) =>
                    brand &&
                    brand.trim() !== "" && (
                      <div key={brand} className="form-check">
                        <input
                          type="checkbox"
                          id={brand}
                          name={brand}
                          checked={productBrand.includes(brand)}
                          onChange={() => {
                            setProductBrand((prev) => {
                              if (prev.includes(brand)) {
                                return prev.filter((item) => item !== brand);
                              } else {
                                return [...prev, brand];
                              }
                            });
                          }}
                          className="form-check-input"
                        />
                        <label htmlFor={brand} className="form-check-label">
                          {brand}
                        </label>
                      </div>
                    )
                )}
              <label htmlFor="colour">Color :</label>
              {uniqueColourArray &&
                uniqueColourArray.map(
                  (color) =>
                    color &&
                    color.trim() !== "" && (
                      <div key={color} className="form-check">
                        <input
                          type="checkbox"
                          id={color}
                          name={color}
                          checked={productColour.includes(color)}
                          onChange={() => {
                            setProductColour((prev) => {
                              if (prev.includes(color)) {
                                return prev.filter((item) => item !== color);
                              } else {
                                return [...prev, color];
                              }
                            });
                          }}
                          className="form-check-input"
                        />
                        <label htmlFor={color} className="form-check-label">
                          {color}
                        </label>
                      </div>
                    )
                )}
              <label htmlFor="size">Size :</label>
              {uniqueSizeArray &&
                uniqueSizeArray.map(
                  (size) =>
                    size &&
                    size.trim() !== "" && (
                      <div key={size} className="form-check">
                        <input
                          type="checkbox"
                          id={size}
                          name={size}
                          checked={productSize.includes(size)}
                          onChange={() => {
                            setProductSize((prev) => {
                              if (prev.includes(size)) {
                                return prev.filter((item) => item !== size);
                              } else {
                                return [...prev, size];
                              }
                            });
                          }}
                          className="form-check-input"
                        />
                        <label htmlFor={size} className="form-check-label">
                          {size}
                        </label>
                      </div>
                    )
                )}
            
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
export default LandingPage;
