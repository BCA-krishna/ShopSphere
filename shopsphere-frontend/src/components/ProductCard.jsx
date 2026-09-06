import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";

import { addToCart } from "../services/cartService";
import { toast } from "react-toastify";

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

    const [wishlistLoading, setWishlistLoading] =
        useState(false);

    const [lastWishlistClick, setLastWishlistClick] =
        useState(0);


    const [cartLoading, setCartLoading] =
        useState(false);

    const [lastCartClick, setLastCartClick] =
        useState(0);


    // Check wishlist status
    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) return;

        const fetchWishlistStatus = async () => {

            try {

                const response =
                    await checkWishlist(product.id);

                setWishlisted(response.data);

            } catch (error) {

                console.error(
                    "Failed to check wishlist status:",
                    error
                );

            }
        };

        fetchWishlistStatus();

    }, [product.id]);


    // ADD TO CART
    const handleAddToCart = async (e) => {

        e.preventDefault();
        e.stopPropagation();

        const now = Date.now();


        // Request already running
        if (cartLoading) {
            return;
        }


        // Rate limit: 1 request per 1.5 seconds
        if (now - lastCartClick < 1500) {
            return;
        }


        try {

            setCartLoading(true);
            setLastCartClick(now);

            await addToCart({
                productId: product.id,
                quantity: 1
            });


            toast.success(
                "Product added to cart!",
                {
                    toastId: `cart-${product.id}`,
                    autoClose: 2000
                }
            );


        } catch (error) {

            console.error(
                "Add to cart error:",
                error
            );


            toast.error(
                "Failed to add product",
                {
                    toastId:
                        `cart-error-${product.id}`
                }
            );


        } finally {

            setCartLoading(false);

        }
    };


    // WISHLIST
    const handleWishlist = async (e) => {

        e.preventDefault();
        e.stopPropagation();


        const token =
            localStorage.getItem("token");


        if (!token) {

            toast.info(
                "Please login first to use wishlist",
                {
                    toastId:
                        "wishlist-login-required",
                    autoClose: 2000
                }
            );

            return;
        }


        const now = Date.now();


        // Request already running
        if (wishlistLoading) {
            return;
        }


        // Rate limit: 1 wishlist action per 1.5 seconds
        if (
            now - lastWishlistClick < 1500
        ) {
            return;
        }


        try {

            setWishlistLoading(true);
            setLastWishlistClick(now);


            if (wishlisted) {

                await removeFromWishlist(
                    product.id
                );


                setWishlisted(false);


                toast.info(
                    "Removed from wishlist",
                    {
                        toastId:
                            `wishlist-remove-${product.id}`,
                        autoClose: 2000
                    }
                );


            } else {

                await addToWishlist(
                    product.id
                );


                setWishlisted(true);


                toast.success(
                    "Added to wishlist!",
                    {
                        toastId:
                            `wishlist-add-${product.id}`,
                        autoClose: 2000
                    }
                );

            }


        } catch (error) {

            console.error(
                "Wishlist error:",
                error
            );


            toast.error(
                "Failed to update wishlist",
                {
                    toastId:
                        `wishlist-error-${product.id}`,
                    autoClose: 2000
                }
            );


        } finally {

            setWishlistLoading(false);

        }
    };


    return (

        <div
            className={`product-card${
                compact
                    ? " product-card-compact"
                    : ""
            }`}
        >


            {/* WISHLIST BUTTON */}

            <button
                type="button"
                className={`wishlist-btn ${
                    wishlisted
                        ? "active"
                        : ""
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


            {/* PRODUCT */}

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


            {/* ADD TO CART */}

            <button
                className="add-btn"
                onClick={handleAddToCart}
                disabled={cartLoading}
            >

                {cartLoading
                    ? "Adding..."
                    : "Add To Cart"
                }

            </button>


        </div>
    );
}


export default ProductCard;