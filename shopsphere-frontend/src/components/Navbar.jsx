import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [query, setQuery] = useState("");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
    window.location.reload();
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const keyword = query.trim();

    if (!keyword) return;

    navigate(`/products?search=${encodeURIComponent(keyword)}`);
  };

  return (
    <div className="navbar-wrapper">
      <nav className="navbar-custom">

        {/* Logo */}
        <Link to="/" className="logo">
          ShopSphere
        </Link>

        {/* Search */}
        <form className="search-box" onSubmit={handleSearch}>

          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <button type="submit" className="search-btn">
            Search
          </button>

        </form>

        {/* Navigation */}
        <div className="nav-links">

          <Link to="/">Home</Link>

          <Link to="/products">Products</Link>

          {token && role === "CUSTOMER" && (
            <>
              <Link to="/cart">Cart</Link>
              <Link to="/orders">Orders</Link>
            </>
          )}

          {token && role === "ADMIN" && (
            <Link to="/admin">Dashboard</Link>
          )}

          {!token ? (
            <>
              <Link className="login-btn" to="/login">
                Login
              </Link>

              <Link className="register-btn" to="/register">
                Register
              </Link>
            </>
          ) : (
            <button
              className="logout-btn"
              onClick={logout}
            >
              Logout
            </button>
          )}

        </div>

      </nav>
    </div>
  );
}

export default Navbar;