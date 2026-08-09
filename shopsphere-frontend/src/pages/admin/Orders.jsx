import { useEffect, useState } from "react";
import {
    getAllOrders,
    updateOrderStatus,
} from "../../services/OrderService";
import "./Orders.css";

const STATUS_OPTIONS = ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"];

const STATUS_TONE = {
    PENDING: "amber",
    SHIPPED: "signal",
    DELIVERED: "emerald",
    CANCELLED: "coral",
};

function Orders() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const response = await getAllOrders();
            setOrders(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (index, status) => {

        const updatedOrders = [...orders];

        updatedOrders[index].status = status;

        setOrders(updatedOrders);
    };

    const handleUpdate = async (order) => {

        try {

            setSavingId(order.orderId);

            await updateOrderStatus(order.orderId, order.status);

            alert("Order status updated successfully");

            loadOrders();

        } catch (error) {
            console.error(error);
            alert("Failed to update status");
        } finally {
            setSavingId(null);
        }
    };

    return (
        <div className="ord-page">

            <header className="ord-header">
                <div>
                    <p className="ord-eyebrow">ShopSphere / Admin</p>
                    <h1 className="ord-title">Manage orders</h1>
                </div>
                {!loading && (
                    <span className="ord-count">
                        {orders.length} order{orders.length === 1 ? "" : "s"}
                    </span>
                )}
            </header>

            <div className="ord-table-card">

                {loading ? (

                    <p className="ord-empty">Loading orders…</p>

                ) : orders.length === 0 ? (

                    <p className="ord-empty">No orders have been placed yet.</p>

                ) : (

                    <div className="ord-table-scroll">

                        <table className="ord-table">

                            <thead>
                                <tr>
                                    <th>Order</th>
                                    <th>Customer</th>
                                    <th>Address</th>
                                    <th>Total</th>
                                    <th>Order date</th>
                                    <th>Status</th>
                                    <th className="ord-th-actions">Action</th>
                                </tr>
                            </thead>

                            <tbody>

                                {orders.map((order, index) => {

                                    const tone = STATUS_TONE[order.status] || "muted";

                                    return (

                                        <tr key={order.orderId}>

                                            <td className="ord-id">#{order.orderId}</td>

                                            <td>
                                                <p className="ord-customer-name">
                                                    {order.fullName || "—"}
                                                </p>
                                                <p className="ord-customer-phone">
                                                    {order.phone || "—"}
                                                </p>
                                            </td>

                                            <td className="ord-address">
                                                {order.deliveryAddress || "—"}
                                                <br />
                                                <span className="ord-address-sub">
                                                    {order.city}, {order.state} - {order.pincode}
                                                </span>
                                            </td>

                                            <td className="ord-total">
                                                <div>₹{Number(order.finalAmount ?? order.totalAmount).toLocaleString("en-IN")}</div>

                                                {order.couponCode && (
                                                    <small className="text-success">
                                                        {order.couponCode} (-₹{order.discount})
                                                    </small>
                                                )}
                                            </td>

                                            <td className="ord-date">
                                                {new Date(order.orderDate).toLocaleString("en-IN", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </td>

                                            <td>
                                                <select
                                                    className={`ord-status-select tone-${tone}`}
                                                    value={order.status}
                                                    onChange={(e) =>
                                                        handleStatusChange(index, e.target.value)
                                                    }
                                                >
                                                    {STATUS_OPTIONS.map((opt) => (
                                                        <option value={opt} key={opt}>
                                                            {opt}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>

                                            <td>
                                                <button
                                                    className="ord-update-btn"
                                                    onClick={() => handleUpdate(order)}
                                                    disabled={savingId === order.orderId}
                                                >
                                                    {savingId === order.orderId ? "Saving…" : "Update"}
                                                </button>
                                            </td>

                                        </tr>

                                    );

                                })}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}

export default Orders;
