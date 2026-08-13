import { useEffect, useState } from "react";
import {
    getAllProducts,
    addProduct,
    updateProduct,
    deleteProduct,
} from "../../services/productService";
import { getImageUrl } from "../../utils/getImageUrl";
import "./Products.css";

const CATEGORIES = [
    { value: "Mobiles", label: "📱 Mobiles" },
    { value: "Laptops", label: "💻 Laptops" },
    { value: "Electronics", label: "🎧 Electronics" },
    { value: "Accessories", label: "🖱 Accessories" },
    { value: "Fashion", label: "👕 Fashion" },
    { value: "Men Clothing", label: "👔 Men Clothing" },
    { value: "Women Clothing", label: "👗 Women Clothing" },
    { value: "Footwear", label: "👟 Footwear" },
    { value: "Watches", label: "⌚ Watches" },
    { value: "Home & Kitchen", label: "🏠 Home & Kitchen" },
    { value: "Furniture", label: "🛋 Furniture" },
    { value: "Appliances", label: "📺 Appliances" },
    { value: "Beauty", label: "💄 Beauty" },
    { value: "Health", label: "❤️ Health" },
    { value: "Sports", label: "⚽ Sports" },
    { value: "Gaming", label: "🎮 Gaming" },
    { value: "Books", label: "📚 Books" },
    { value: "Toys", label: "🧸 Toys" },
    { value: "Groceries", label: "🛒 Groceries" },
    { value: "Snacks", label: "🍿 Snacks" },
    { value: "Pet Supplies", label: "🐶 Pet Supplies" },
];

const EMPTY_FORM = {
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: null,
};

function Products() {

    const [products, setProducts] = useState([]);

    const [formData, setFormData] = useState(EMPTY_FORM);

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);

    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const response = await getAllProducts();
            setProducts(response.data.content);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleImageChange = (e) => {

        const file = e.target.files[0];

        setFormData({
            ...formData,
            image: file,
        });

        setImagePreview(file ? URL.createObjectURL(file) : null);
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const data = new FormData();

            data.append("name", formData.name);
            data.append("description", formData.description);
            data.append("price", formData.price);
            data.append("stock", formData.stock);
            data.append("category", formData.category);

            if (formData.image) {
                data.append("image", formData.image);
            }

            if (editingId) {

                await updateProduct(editingId, data);

                alert("Product Updated Successfully");

            } else {

                await addProduct(data);

                alert("Product Added Successfully");
            }

            resetForm();

            loadProducts();

        } catch (error) {

            console.error(error);

            alert("Operation Failed");
        }
    };

    const handleDelete = async (id) => {

        if (!window.confirm("Are you sure you want to delete this product?")) {
            return;
        }

        try {

            await deleteProduct(id);

            alert("Product Deleted Successfully");

            loadProducts();

        } catch (error) {

            console.error(error);

            alert("Delete Failed");
        }
    };

    const handleEdit = (product) => {

        setEditingId(product.id);

        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            category: product.category,
            image: null,
        });

        setImagePreview(null);

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData(EMPTY_FORM);
        setImagePreview(null);
    };

    const stockTone = (stock) => {
        if (stock <= 0) return "out";
        if (stock <= 5) return "low";
        return "ok";
    };

    return (

        <div className="prod-page">

            <header className="prod-header">
                <p className="prod-eyebrow">ShopSphere / Admin</p>
                <h1 className="prod-title">Products</h1>
                <p className="prod-subtitle">
                    {loading ? "Loading catalogue…" : `${products.length} product${products.length === 1 ? "" : "s"} in your catalogue`}
                </p>
            </header>

            <form className="prod-form" onSubmit={handleSubmit}>

                <div className="prod-form-head">

                    <h2 className="prod-form-title">
                        {editingId ? "Update product" : "Add a product"}
                    </h2>

                    {editingId && (
                        <button
                            type="button"
                            className="prod-cancel-btn"
                            onClick={resetForm}
                        >
                            Cancel edit
                        </button>
                    )}

                </div>

                <div className="prod-form-grid">

                    <div className="prod-field">
                        <label className="prod-label" htmlFor="name">Product name</label>
                        <input
                            id="name"
                            type="text"
                            className="prod-input"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Wireless Headphones"
                            required
                        />
                    </div>

                    <div className="prod-field">
                        <label className="prod-label" htmlFor="price">Price (₹)</label>
                        <input
                            id="price"
                            type="number"
                            className="prod-input"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="0.00"
                            required
                        />
                    </div>

                    <div className="prod-field prod-field-wide">
                        <label className="prod-label" htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            className="prod-input prod-textarea"
                            rows="3"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="What makes this product worth listing?"
                            required
                        />
                    </div>

                    <div className="prod-field">
                        <label className="prod-label" htmlFor="stock">Stock</label>
                        <input
                            id="stock"
                            type="number"
                            className="prod-input"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            placeholder="0"
                            required
                        />
                    </div>

                    <div className="prod-field">
                        <label className="prod-label" htmlFor="category">Category</label>
                        <select
                            id="category"
                            className="prod-input"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select category</option>
                            {CATEGORIES.map((cat) => (
                                <option value={cat.value} key={cat.value}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="prod-field prod-field-wide">
                        <label className="prod-label" htmlFor="image">Product image</label>
                        <div className="prod-image-row">
                            <input
                                id="image"
                                type="file"
                                accept="image/*"
                                className="prod-input prod-file"
                                onChange={handleImageChange}
                            />
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Selected preview"
                                    className="prod-image-preview"
                                />
                            )}
                        </div>
                    </div>

                </div>

                <div className="prod-form-footer">
                    <button type="submit" className="prod-submit-btn">
                        {editingId ? "Save changes" : "Add product"}
                    </button>
                </div>

            </form>

            <div className="prod-table-card">

                {loading ? (

                    <p className="prod-empty">Loading products…</p>

                ) : products.length === 0 ? (

                    <p className="prod-empty">No products yet. Add your first one above.</p>

                ) : (

                    <div className="prod-table-scroll">

                        <table className="prod-table">

                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Description</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Category</th>
                                    <th className="prod-th-actions">Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {products.map((product) => (

                                    <tr key={product.id}>

                                        <td>
                                            <div className="prod-name-cell">
                                                <img
                                                    src={getImageUrl(product.imageUrl)}
                                                    alt={product.name}
                                                    className="prod-thumb"
                                                />
                                                <div>
                                                    <p className="prod-name">{product.name}</p>
                                                    <p className="prod-id">#{product.id}</p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="prod-desc">
                                            {product.description}
                                        </td>

                                        <td className="prod-price">
                                            ₹{product.price.toLocaleString("en-IN")}
                                        </td>

                                        <td>
                                            <span className={`prod-stock-pill tone-${stockTone(product.stock)}`}>
                                                {product.stock <= 0 ? "Out of stock" : `${product.stock} in stock`}
                                            </span>
                                        </td>

                                        <td>
                                            <span className="prod-category-pill">
                                                {product.category}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="prod-actions">
                                                <button
                                                    className="prod-edit-btn"
                                                    onClick={() => handleEdit(product)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="prod-delete-btn"
                                                    onClick={() => handleDelete(product.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}

export default Products;
