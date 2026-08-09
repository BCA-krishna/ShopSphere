import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { addToCart } from "../services/cartService";
import "./ProductCard.css";

function ProductCard({ product, compact }) {

    const imageUrl = product.imageUrl
        ? `http://localhost:8080/uploads/${product.imageUrl}`
        : "https://via.placeholder.com/300x300?text=No+Image";

    const handleAddToCart = async (e) => {
        e.preventDefault();

        try {
            await addToCart({
                productId: product.id,
                quantity: 1
            });

            alert("Product added to cart");

        } catch (error) {
            alert("Failed to add product");
        }
    };

    return (
        <div className={`product-card${compact ? " product-card-compact" : ""}`}>

            <Link
                to={`/products/${product.id}`}
                className="product-card-link"
            >

                <div className="image-box">
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="product-image"
                    />
                </div>

                <div className="product-info">

                    <h5 className="product-title">
                        {product.name}
                    </h5>

                    <p className="product-description">
                        {product.description}
                    </p>

                    <span className="rating-badge">
                        4.0 <FaStar />
                    </span>

                    <h4 className="product-price">
                        ₹{product.price}
                    </h4>

                </div>

            </Link>

            <button
                className="add-btn"
                onClick={handleAddToCart}
            >
                Add To Cart
            </button>

        </div>
    );
}

export default ProductCard;