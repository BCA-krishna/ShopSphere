import { useNavigate } from "react-router-dom";
import { placeOrder } from "../../services/orderService";
import "./Checkout.css";
import { useEffect, useState } from "react";
import { applyCoupon } from "../../services/couponService";
import { getCart } from "../../services/cartService";

function Checkout() {

    const [couponCode, setCouponCode] = useState("");
    const [subtotal, setSubtotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [finalAmount, setFinalAmount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {

        try {

            const response = await getCart();

            const items = response.data.items;

            let total = items.reduce((sum, item) => {
                return sum + (item.price * item.quantity);
            }, 0);

            setSubtotal(total);
            setFinalAmount(total);

        } catch (error) {

            console.error(error);

        }

    };


const handleApplyCoupon = async () => {

    if (!couponCode.trim()) {
        alert("Enter coupon code");
        return;
    }

    try {

        const response = await applyCoupon({
            code: couponCode,
            orderAmount: subtotal
        });

        setDiscount(response.data.discount);
        setFinalAmount(response.data.finalAmount);

        alert(response.data.message);

    } catch (error) {

        console.error(error);

        alert(error.response?.data?.message || "Invalid Coupon");

    }

};



    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: ""
    });

    const [submitting, setSubmitting] = useState(false);

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {

        const { name, value } = e.target;

        if (name === "phone" && !/^\d*$/.test(value)) {
            return;
        }

        if (name === "pincode" && !/^\d*$/.test(value)) {
            return;
        }

        setFormData({
            ...formData,
            [name]: value
        });

        setErrors({
            ...errors,
            [name]: ""
        });

    };

    const validateForm = () => {

        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full name is required";
        }

        const phoneRegex = /^[6-9]\d{9}$/;

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = "Enter a valid 10-digit phone number";
        }

        if (!formData.address.trim()) {
            newErrors.address = "Delivery address is required";
        }

        if (!formData.city.trim()) {
            newErrors.city = "City is required";
        }

        if (!formData.state.trim()) {
            newErrors.state = "State is required";
        }

        if (!formData.pincode.trim()) {
            newErrors.pincode = "Pincode is required";
        } else if (!/^\d{6}$/.test(formData.pincode)) {
            newErrors.pincode = "Enter a valid 6-digit pincode";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleCheckout = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
                return;
        }

        try {
            setSubmitting(true);

            await placeOrder({
                fullName: formData.fullName,
                phone: formData.phone,
                deliveryAddress: formData.address,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
                couponCode: couponCode
            });

            alert("Order Placed Successfully");

            navigate("/orders");

        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed To Place Order"
            );

        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="checkout-page">

            <h2 className="checkout-title">Checkout</h2>
            <p className="checkout-subtitle">
                Tell us where to send your order.
            </p>

            <form className="checkout-form" onSubmit={handleCheckout}>

                <div className="checkout-section">

                    <h6 className="checkout-section-heading">Contact</h6>

                    <div className="checkout-grid">

                        <div className="checkout-field">
                            <label className="checkout-label" htmlFor="fullName">Full name</label>
                            <input
                                id="fullName"
                                className="checkout-input"
                                name="fullName"
                                placeholder="Krishna Patel"
                                value={formData.fullName}
                                onChange={handleChange}
                            />

                            {errors.fullName && (
                                <small className="field-error">
                                    {errors.fullName}
                                </small>
                            )}
                        </div>

                        <div className="checkout-field">
                            <label className="checkout-label" htmlFor="phone">Phone number</label>
                            <input
                                id="phone"
                                type="tel"
                                className="checkout-input"
                                name="phone"
                                placeholder="9876543210"
                                value={formData.phone}
                                onChange={handleChange}
                                inputMode="numeric"
                                maxLength="10"
                            />

                            {errors.phone && (
                                <small className="field-error">
                                    {errors.phone}
                                </small>
                            )}
                        </div>

                    </div>

                </div>

                <div className="checkout-section">

                    <h6 className="checkout-section-heading">Delivery address</h6>

                    <div className="checkout-field checkout-field-wide">
                        <label className="checkout-label" htmlFor="address">Full address</label>
                        <textarea
                            id="address"
                            className="checkout-input checkout-textarea"
                            name="address"
                            placeholder="House no., street, landmark"
                            rows="3"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                        {errors.address && (
                            <small className="field-error">
                                {errors.address}
                            </small>
                        )}
                    </div>

                    <div className="checkout-grid checkout-grid-three">

                        <div className="checkout-field">
                            <label className="checkout-label" htmlFor="city">City</label>
                            <input
                                id="city"
                                className="checkout-input"
                                name="city"
                                placeholder="Mathura"
                                value={formData.city}
                                onChange={handleChange}
                                required
                            />
                            {errors.city && (
                                <small className="field-error">
                                    {errors.city}
                                </small>
                            )}
                        </div>

                        <div className="checkout-field">
                            <label className="checkout-label" htmlFor="state">State</label>
                            <input
                                id="state"
                                className="checkout-input"
                                name="state"
                                placeholder="Uttar Pradesh"
                                value={formData.state}
                                onChange={handleChange}
                                required
                            />
                            {errors.state && (
                                <small className="field-error">
                                    {errors.state}
                                </small>
                            )}
                        </div>

                        <div className="checkout-field">
                            <label className="checkout-label" htmlFor="pincode">Pincode</label>
                            <input
                                id="pincode"
                                className="checkout-input"
                                name="pincode"
                                placeholder="281121"
                                inputMode="numeric"
                                value={formData.pincode}
                                onChange={handleChange}
                                required
                            />
                            {errors.pincode && (
                                <small className="field-error">
                                    {errors.pincode}
                                </small>
                            )}
                        </div>

                    </div>

                </div>

                <hr />

                <h5>Apply Coupon</h5>

                <div className="input-group mb-3">

                    <input
                        type="text"
                        className="form-control"
                        placeholder="Coupon Code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                    />

                    <button
                        type="button"
                        className="btn btn-warning"
                        onClick={handleApplyCoupon}
                    >
                        Apply
                    </button>

                </div>

                <div className="card p-3 mb-3">

                    <p><strong>Subtotal:</strong> ₹{subtotal}</p>

                    <p><strong>Discount:</strong> ₹{discount}</p>

                    <h5>Final Total: ₹{finalAmount}</h5>

                </div>

                <button
                    type="submit"
                    className="checkout-submit-btn"
                    disabled={submitting}
                >
                    {submitting ? "Placing order…" : "Place order"}
                </button>

            </form>

        </div>
    );
}

export default Checkout;
