import { Routes, Route } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import Home from "../pages/customer/Home";
import Products from "../pages/customer/Products";
import ProductDetails from "../pages/customer/ProductDetails";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Cart from "../pages/customer/Cart";
import Orders from "../pages/customer/Orders";

import Dashboard from "../pages/admin/Dashboard";
import ProductsAdmin from "../pages/admin/Products";
import OrdersAdmin from "../pages/admin/Orders";
import Users from "../pages/admin/Users";
import Checkout from "../pages/customer/Checkout";
import Coupons from "../pages/admin/Coupons";

import "./AppRoutes.css";

function AppRoutes() {
    return (
        <>
            <Navbar />

            <main className="page-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetails />} />

                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/orders" element={<Orders />} />

                    <Route path="/admin" element={<Dashboard />} />
                    <Route path="/admin/products" element={<ProductsAdmin />} />
                    <Route path="/admin/orders" element={<OrdersAdmin />} />
                    <Route path="/admin/users" element={<Users />} />
                    <Route
                        path="/admin/coupons"
                        element={<Coupons />}
                    />
                </Routes>
            </main>

            <Footer />
        </>
    );
}

export default AppRoutes;