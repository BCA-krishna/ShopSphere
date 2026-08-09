import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaStar, FaRegStar, FaTruck, FaShieldAlt, FaUndo } from "react-icons/fa";
import { getProductById } from "../../services/productService";
import { addToCart } from "../../services/cartService";
import "./ProductDetails.css";

function ProductDetails() {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        fetchProduct();
    }, []);

    const fetchProduct = async () => {
        try {
            const response = await getProductById(id);
            setProduct(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddToCart = async () => {
        setAdding(true);
        try {
            await addToCart({
                productId: product.id,
                quantity
            });
            alert("Added to Cart");
        } catch (error) {
            alert("Failed");
        } finally {
            setAdding(false);
        }
    };

    if (!product) {
        return (
            <div className="pd-loading">
                <div className="pd-spinner" />
                <span>Loading product…</span>
            </div>
        );
    }

    const imageUrl = product.imageUrl
        ? `https://shopsphere-backend-w77.onrender.com/uploads/${product.imageUrl}`
        : "https://via.placeholder.com/500";

    return (
        <div className="container pd-container">
            <div className="row details-card">

                <div className="col-lg-5">
                    <div className="details-image-wrap">
                        <img
                            src={imageUrl}
                            className="details-image"
                            alt={product.name}
                        />
                    </div>
                </div>

                <div className="col-lg-7">
                    <span className="pd-eyebrow">Product Details</span>

                    <h2 className="pd-title">{product.name}</h2>

                    <div className="rating">
                        {[1, 2, 3, 4].map((n) => <FaStar key={n} />)}
                        <FaRegStar className="text-secondary" />
                        <span>(4.0)</span>
                    </div>

                    <div className="price-block">
                        <h2 className="price">₹{product.price}</h2>
                        <span className="price-note">inclusive of all taxes</span>
                    </div>

                    <p className="pd-description">
                        {product.description}
                    </p>

                    <div className="quantity-box">
                        <button
                            disabled={quantity <= 1}
                            onClick={() =>
                                quantity > 1 &&
                                setQuantity(quantity - 1)
                            }
                        >
                            −
                        </button>

                        <span>{quantity}</span>

                        <button
                            onClick={() =>
                                setQuantity(quantity + 1)
                            }
                        >
                            +
                        </button>
                    </div>

                    <div className="pd-actions">
                        <button
                            className="btn btn-outline-cart"
                            onClick={handleAddToCart}
                            disabled={adding}
                        >
                            {adding ? "Adding…" : "Add To Cart"}
                        </button>

                        <button className="btn btn-buy-now">
                            Buy Now
                        </button>
                    </div>

                    <div className="pd-trust-strip">
                        <div className="pd-trust-item">
                            <FaTruck />
                            <div>
                                <strong>Free Delivery</strong>
                                <span>2–4 business days</span>
                            </div>
                        </div>
                        <div className="pd-trust-item">
                            <FaUndo />
                            <div>
                                <strong>Easy Returns</strong>
                                <span>7 day return window</span>
                            </div>
                        </div>
                        <div className="pd-trust-item">
                            <FaShieldAlt />
                            <div>
                                <strong>Secure Payment</strong>
                                <span>100% protected</span>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default ProductDetails;