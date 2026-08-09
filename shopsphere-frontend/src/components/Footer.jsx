import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="container">

        <div className="row">

          <div className="col-md-4 mb-4">

            <h4>ShopSphere</h4>

            <p>
              Your one-stop destination for quality products at the
              best prices.
            </p>

          </div>

          <div className="col-md-2 mb-4">

            <h5>Quick Links</h5>

            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            <Link to="/cart">Cart</Link>

          </div>

          <div className="col-md-3 mb-4">

            <h5>Customer</h5>

            <Link to="/orders">My Orders</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>

          </div>

          <div className="col-md-3 mb-4">

            <h5>Contact</h5>

            <p>📧 support@shopsphere.com</p>
            <p>📞 +91 987xxxx210</p>

          </div>

        </div>

        <hr />

        <p className="text-center mb-0">
          © 2026 ShopSphere. All Rights Reserved.
        </p>

      </div>

    </footer>
  );
}

export default Footer;