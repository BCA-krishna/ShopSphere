import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag } from "react-icons/fi";
import {
    getCart,
    removeCartItem,
    updateCartItem
} from "../../services/cartService";
import "./Cart.css";

function Cart() {

    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {

        try {

            setLoading(true);

            const response = await getCart();

            setCart(response.data.items);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    const getTotal = () => {

        return cart.reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);

    };

    const handleRemove = async (cartItemId) => {

        try {

            await removeCartItem(cartItemId);

            loadCart();

        } catch (error) {

            console.error(error);

            alert("Failed to remove item");

        }

    };

    const updateQuantity = async (item, quantity) => {

        if (quantity < 1) {
            return;
        }

        try {

            await updateCartItem(
                item.cartItemId,
                quantity
            );

            loadCart();

        } catch (error) {

            console.error(error);

            alert("Failed to update quantity");

        }

    };

    const total = getTotal();

    return (

        <div className="cart-page">

            <h2 className="cart-title">My cart</h2>

            {loading ? (

                <div className="cart-skeleton">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div className="cart-skeleton-row" key={i} />
                    ))}
                </div>

            ) : cart.length === 0 ? (

                <div className="cart-empty">
                    <FiShoppingBag className="cart-empty-icon" />
                    <h4>Your cart is empty</h4>
                    <p>Add something you like and it'll show up here.</p>
                    <Link to="/products" className="cart-empty-cta">
                        Browse products
                    </Link>
                </div>

            ) : (

                <div className="cart-layout">

                    <div className="cart-items">

                        {cart.map((item) => (

                            <div className="cart-row" key={item.productId}>

                                <div className="cart-row-main">
                                    <p className="cart-item-name">{item.productName}</p>
                                    <p className="cart-item-price">
                                        ₹{item.price.toLocaleString("en-IN")} each
                                    </p>
                                </div>

                                <div className="cart-qty">
                                    <button
                                        className="cart-qty-btn"
                                        onClick={() => updateQuantity(item, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                        aria-label="Decrease quantity"
                                    >
                                        <FiMinus />
                                    </button>

                                    <span className="cart-qty-value">{item.quantity}</span>

                                    <button
                                        className="cart-qty-btn"
                                        onClick={() => updateQuantity(item, item.quantity + 1)}
                                        aria-label="Increase quantity"
                                    >
                                        <FiPlus />
                                    </button>
                                </div>

                                <p className="cart-line-total">
                                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                                </p>

                                <button
                                    className="cart-remove-btn"
                                    onClick={() => handleRemove(item.cartItemId)}
                                    aria-label={`Remove ${item.productName}`}
                                >
                                    <FiTrash2 />
                                </button>

                            </div>

                        ))}

                    </div>

                    <aside className="cart-summary">

                        <h5 className="cart-summary-title">Order summary</h5>

                        <div className="cart-summary-row">
                            <span>Subtotal</span>
                            <span>₹{total.toLocaleString("en-IN")}</span>
                        </div>

                        <div className="cart-summary-row cart-summary-note">
                            <span>Delivery</span>
                            <span>Calculated at checkout</span>
                        </div>

                        <div className="cart-summary-divider"></div>

                        <div className="cart-summary-row cart-summary-total">
                            <span>Total</span>
                            <span>₹{total.toLocaleString("en-IN")}</span>
                        </div>

                        <button
                            className="cart-checkout-btn"
                            onClick={() => navigate("/checkout")}
                        >
                            Proceed to checkout
                        </button>

                    </aside>

                </div>

            )}

        </div>

    );
}

export default Cart;
