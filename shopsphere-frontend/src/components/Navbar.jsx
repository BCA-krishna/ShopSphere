import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMic } from "react-icons/fi";
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
const startVoiceSearch = () => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice search is not supported in this browser.");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = "en-IN";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const spokenText = event.results[0][0].transcript;

    setQuery(spokenText);

    navigate(
      `/products?search=${encodeURIComponent(spokenText)}`
    );
  };

  recognition.onerror = (event) => {
    console.error("Voice search error:", event.error);
  };

  recognition.start();
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

          <div className="search-input-wrapper">

            <input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <button
              type="button"
              className="voice-search-btn"
              onClick={startVoiceSearch}
              title="Voice search"
              aria-label="Voice search"
            >
              <FiMic />
            </button>

          </div>

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