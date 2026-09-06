import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { addToCart } from "../services/cartService";
import {
    addToWishlist,
    removeFromWishlist,
    checkWishlist
} from "../services/wishlistService";
import { getImageUrl } from "../utils/getImageUrl";
import "./ProductCard.css";

function ProductCard({ product, compact }) {

    const imageUrl = getImageUrl(product.imageUrl);

    const [wishlisted, setWishlisted] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) return;

        const fetchWishlistStatus = async () => {

            try {

                const response = await checkWishlist(product.id);

                setWishlisted(response.data);

            } catch (error) {

                console.error("Failed to check wishlist status:", error);

            }
        };

        fetchWishlistStatus();

    }, [product.id]);

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


    const handleWishlist = async (e) => {

        e.preventDefault();
        e.stopPropagation();

        const token = localStorage.getItem("token");

        if (!token) {

            alert("Please login first to use wishlist");
            return;

        }

        try {

            setWishlistLoading(true);

            if (wishlisted) {

                await removeFromWishlist(product.id);

                setWishlisted(false);

            } else {

                await addToWishlist(product.id);

                setWishlisted(true);

            }

        } catch (error) {

            console.error("Wishlist error:", error);

            alert("Failed to update wishlist");

        } finally {

            setWishlistLoading(false);

        }
    };


    return (

        <div
            className={`product-card${
                compact ? " product-card-compact" : ""
            }`}
        >

            {/* Wishlist Button */}
            <button
                type="button"
                className={`wishlist-btn ${
                    wishlisted ? "active" : ""
                }`}
                onClick={handleWishlist}
                disabled={wishlistLoading}
                title={
                    wishlisted
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                }
            >

                {wishlisted ? (
                    <FaHeart />
                ) : (
                    <FaRegHeart />
                )}

            </button>


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