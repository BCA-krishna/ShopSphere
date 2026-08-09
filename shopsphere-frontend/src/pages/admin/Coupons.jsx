import { useEffect, useState } from "react";
import {
    createCoupon,
    deleteCoupon,
    getAllCoupons,
    updateCoupon
} from "../../services/couponService";

function Coupons() {

    const [coupons, setCoupons] = useState([]);

    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        code: "",
        discountPercentage: "",
        minimumOrderAmount: "",
        expiryDate: "",
        active: true
    });

    useEffect(() => {
        loadCoupons();
    }, []);

    const loadCoupons = async () => {

        try {

            const response = await getAllCoupons();

            setCoupons(response.data);

        } catch (error) {

            console.error(error);

        }

    };

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setFormData({

            ...formData,

            [name]: type === "checkbox"
                ? checked
                : value

        });

    };

    const resetForm = () => {

        setEditingId(null);

        setFormData({

            code: "",
            discountPercentage: "",
            minimumOrderAmount: "",
            expiryDate: "",
            active: true

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            if (editingId) {

                await updateCoupon(editingId, formData);

                alert("Coupon updated successfully");

            } else {

                await createCoupon(formData);

                alert("Coupon created successfully");

            }

            resetForm();

            loadCoupons();

        } catch (error) {

            console.error(error);

            alert("Operation failed");

        }

    };

    const handleEdit = (coupon) => {

        setEditingId(coupon.id);

        setFormData({

            code: coupon.code,

            discountPercentage: coupon.discountPercentage,

            minimumOrderAmount: coupon.minimumOrderAmount,

            expiryDate: coupon.expiryDate,

            active: coupon.active

        });

    };

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this coupon?"))
            return;

        try {

            await deleteCoupon(id);

            alert("Coupon deleted");

            loadCoupons();

        } catch (error) {

            console.error(error);

        }

    };

    return (

        <div className="container mt-4">

            <h2 className="mb-4">
                Manage Coupons
            </h2>

            <div className="card shadow p-4 mb-4">

                <form onSubmit={handleSubmit}>

                    <div className="row">

                        <div className="col-md-4">

                            <input
                                className="form-control"
                                placeholder="Coupon Code"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="col-md-2">

                            <input
                                type="number"
                                className="form-control"
                                placeholder="%"
                                name="discountPercentage"
                                value={formData.discountPercentage}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="col-md-2">

                            <input
                                type="number"
                                className="form-control"
                                placeholder="Minimum Order"
                                name="minimumOrderAmount"
                                value={formData.minimumOrderAmount}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="col-md-2">

                            <input
                                type="date"
                                className="form-control"
                                name="expiryDate"
                                value={formData.expiryDate}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="col-md-2">

                            <div className="form-check mt-2">

                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    name="active"
                                    checked={formData.active}
                                    onChange={handleChange}
                                />

                                <label className="form-check-label">
                                    Active
                                </label>

                            </div>

                        </div>

                    </div>

                    <button
                        className="btn btn-primary mt-3"
                    >
                        {editingId
                            ? "Update Coupon"
                            : "Add Coupon"}
                    </button>

                    {editingId && (

                        <button
                            type="button"
                            className="btn btn-secondary mt-3 ms-2"
                            onClick={resetForm}
                        >
                            Cancel
                        </button>

                    )}

                </form>

            </div>

            <table className="table table-bordered table-hover">

                <thead>

                <tr>

                    <th>Code</th>
                    <th>Discount</th>
                    <th>Min Order</th>
                    <th>Expiry</th>
                    <th>Status</th>
                    <th>Action</th>

                </tr>

                </thead>

                <tbody>

                {

                    coupons.map((coupon) => (

                        <tr key={coupon.id}>

                            <td>{coupon.code}</td>

                            <td>
                                {coupon.discountPercentage}%
                            </td>

                            <td>
                                ₹{coupon.minimumOrderAmount}
                            </td>

                            <td>
                                {coupon.expiryDate}
                            </td>

                            <td>

                                {

                                    coupon.active ?

                                        <span className="badge bg-success">
                                            Active
                                        </span>

                                        :

                                        <span className="badge bg-danger">
                                            Inactive
                                        </span>

                                }

                            </td>

                            <td>

                                <button
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() => handleEdit(coupon)}
                                >
                                    Edit
                                </button>

                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(coupon.id)}
                                >
                                    Delete
                                </button>

                            </td>

                        </tr>

                    ))

                }

                </tbody>

            </table>

        </div>

    );
}

export default Coupons;