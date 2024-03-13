import React, { useEffect,useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/warehouse.png";
import menu from "../assets/sort.png";

function Navbar() {
  const [role, setRole] = useState("");
  const UserId = localStorage.getItem("email");
  const navigate = useNavigate();
  const handleLogout = () => {
    axios
      .post(`http://localhost:5001/api/user/logout`)
      .then((response) => {
        console.log(response);
        navigate("/");
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
    findRole();
  }, []);
  let content;
  let contents;
  let contentss;
  let contentsss;
  if (role === "admin") {
    content = (
      <li className="mx-4">
        <Link
          to="/AddProducts"
          style={{ textDecoration: "none", color: "white" }}
        >
          Add Products
        </Link>
      </li>
    );
    contents = (
      <li className="mx-4">
        <Link to="/AddUser" style={{ textDecoration: "none", color: "white" }}>
          Add User
        </Link>
      </li>
    );
    contentss = (
      <li className="mx-4">
        <Link
          to="/ShowUsers"
          style={{ textDecoration: "none", color: "white" }}
        >
          Show Users
        </Link>
      </li>
    );
    contentsss = (
      <li className="mx-4">
        <Link
          to="/Categories"
          style={{ textDecoration: "none", color: "white" }}
        >
          Categories
        </Link>
      </li>
    );
  } else {
    content = <div></div>;
    contents = <div></div>;
    contentss = <div></div>;
    contentsss = <div></div>
  }
  return (
    <div>
      <div className="container-fluid bg-dark text-light">
        <nav
          className="d-flex align-items-center justify-content-between"
          style={{ height: "4rem" }}
        >
          <h4>
            <img
              src={logo}
              alt="logo"
              style={{ height: "2rem" }}
              className="mx-3"
            />
            Stock Management App
          </h4>
          <ul style={{ listStyleType: "none" }} className="d-flex">
            <li className="mx-4">
              <Link
                to="/UserDashboard"
                style={{ textDecoration: "none", color: "white" }}
              >
                Home
              </Link>
            </li>
            <li className="mx-4">
              <Link
                to="/landing"
                style={{ textDecoration: "none", color: "white" }}
              >
                Show Products
              </Link>
            </li>
            {content}
            {contents}
            {contentss}
            {contentsss}
            <li
              onClick={handleLogout}
              style={{ cursor: "pointer" }}
              className="mx-4"
            >
              Logout
            </li>
          </ul>
          <div className="toggle-btn">
            <img
              src={menu}
              alt="menu"
              style={{ height: "2rem", cursor: "pointer", display: "none" }}
              className="text-light"
            />
          </div>
        </nav>
      </div>
    </div>
  );
}
export default Navbar;
