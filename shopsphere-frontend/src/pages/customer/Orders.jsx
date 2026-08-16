import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FiPackage,
    FiUser,
    FiPhone,
    FiMapPin,
    FiCalendar
} from "react-icons/fi";
import {
    getMyOrders,
    cancelOrder,
} from "../../services/orderService";
import "./Orders.css";

const STATUS_STYLES = {
    delivered: "leaf",
    completed: "leaf",
    shipped: "signal",
    dispatched: "signal",
    processing: "marigold",
    pending: "marigold",
    confirmed: "marigold",
    cancelled: "coral",
    failed: "coral",
    returned: "coral",
};

function getStatusTone(status) {
    const key = status?.toLowerCase();
    return STATUS_STYLES[key] || "muted";
}


function Orders() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {

        try {

            setLoading(true);

            const response = await getMyOrders();

            setOrders(response.data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    const handleCancelOrder = async (orderId) => {

        const confirmed = window.confirm(
            "Are you sure you want to cancel this order?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await cancelOrder(orderId);

            alert("Order cancelled successfully");

            loadOrders();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to cancel order"
            );

        }

    };

    return (

        <div className="orders-page">

            <div className="orders-header">
                <h2 className="orders-title">My orders</h2>
                {!loading && (
                    <p className="orders-count">
                        {orders.length === 0
                            ? "No orders yet"
                            : `${orders.length} order${orders.length === 1 ? "" : "s"}`}
                    </p>
                )}
            </div>

            {loading ? (

                <div className="orders-list">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div className="order-skeleton" key={i} />
                    ))}
                </div>

            ) : orders.length === 0 ? (

                <div className="orders-empty">
                    <FiPackage className="orders-empty-icon" />
                    <h4>No orders found</h4>
                    <p>Everything you order will show up here.</p>
                    <Link to="/products" className="orders-empty-cta">
                        Start shopping
                    </Link>
                </div>

            ) : (

                <div className="orders-list">

                    {orders.map((order) => {

                        const itemsTotal = order.items.reduce(
                            (sum, item) => sum + item.price * item.quantity,
                            0
                        );

                        return (

                            <div key={order.orderId} className="order-ticket">

                                <div className="order-ticket-top">

                                    <div>
                                        <p className="order-id">Order #{order.orderId}</p>
                                        <p className="order-date">
                                            <FiCalendar />
                                            {order.orderDate}
                                        </p>
                                    </div>

                                    <span className={`order-status tone-${getStatusTone(order.status)}`}>
                                        {order.status}
                                    </span>

                                </div>

                                <div className="order-perforation" aria-hidden="true"></div>

                                <div className="order-ticket-body">

                                    <div className="order-delivery">

                                        <h6 className="order-block-heading">Delivery details</h6>

                                        <p className="order-detail-row">
                                            <FiUser />
                                            {order.fullName}
                                        </p>

                                        <p className="order-detail-row">
                                            <FiPhone />
                                            {order.phone}
                                        </p>

                                        <p className="order-detail-row">
                                            <FiMapPin />
                                            <span>
                                                {order.deliveryAddress}, {order.city}, {order.state} - {order.pincode}
                                            </span>
                                        </p>

                                    </div>

                                    <div className="order-items">

                                        <h6 className="order-block-heading">Items</h6>

                                        <div className="order-items-table">

                                            <div className="order-items-head">
                                                <span>Product</span>
                                                <span>Price</span>
                                                <span>Qty</span>
                                            </div>

                                            {order.items.map((item, index) => (
                                                <div
                                                    className="order-item-row"
                                                    key={`${order.orderId}-${index}`}
                                                >
                                                    <span className="order-item-name">
                                                        {item.productName}
                                                    </span>

                                                    <span className="order-item-price">
                                                        ₹{item.price.toLocaleString("en-IN")}
                                                    </span>

                                                    <span className="order-item-qty">
                                                        ×{item.quantity}
                                                    </span>
                                                </div>
                                            ))}

                                        </div>

                                    </div>

                                </div>

                                <div className="ord-total-section">

                                    {order.couponCode && (
                                        <div className="ord-price-details">

                                            <div className="ord-price-row">
                                                <span>Subtotal</span>
                                                <span>
                                                    ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                                                </span>
                                            </div>

                                            <div className="ord-price-row ord-discount">
                                                <span>
                                                    Coupon ({order.couponCode})
                                                </span>
                                                <span>
                                                    -₹{Number(order.discount || 0).toLocaleString("en-IN")}
                                                </span>
                                            </div>

                                        </div>
                                    )}

                                    <div className="ord-final-total">
                                        <span>Total paid</span>

                                        <strong>
                                            ₹{Number(
                                                order.finalAmount ?? order.totalAmount
                                            ).toLocaleString("en-IN")}
                                        </strong>
                                    </div>

                                </div>

                                {order.status === "PENDING" && (

                                    <div className="order-actions">

                                        <button
                                            className="order-cancel-btn"
                                            onClick={() => handleCancelOrder(order.orderId)}
                                        >
                                            Cancel Order
                                        </button>

                                    </div>

                                )}

                            </div>

                        );

                    })}

                </div>

            )}

        </div>

    );

}

export default Orders;
