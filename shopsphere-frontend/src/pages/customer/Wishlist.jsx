import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaTrash } from "react-icons/fa";

import {
    getWishlist,
    removeFromWishlist
} from "../../services/wishlistService";

import { getImageUrl } from "../../utils/getImageUrl";

import "./Wishlist.css";


function Wishlist() {

    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        fetchWishlist();

    }, []);


    const fetchWishlist = async () => {

        try {

            setLoading(true);

            const response =
                await getWishlist();

            setWishlist(response.data);

        } catch (error) {

            console.error(
                "Failed to load wishlist:",
                error
            );

        } finally {

            setLoading(false);

        }
    };


    const handleRemove = async (productId) => {

        try {

            await removeFromWishlist(productId);

            setWishlist((currentWishlist) =>
                currentWishlist.filter(
                    (item) =>
                        item.productId !== productId
                )
            );

        } catch (error) {

            console.error(
                "Failed to remove wishlist item:",
                error
            );

            alert(
                "Failed to remove product from wishlist"
            );

        }
    };


    if (loading) {

        return (
            <div className="wishlist-page">

                <h2>My Wishlist</h2>

                <p>Loading wishlist...</p>

            </div>
        );
    }


    return (

        <div className="wishlist-page">

            <div className="wishlist-header">

                <h2>
                    <FaHeart />
                    My Wishlist
                </h2>

                <p>
                    {wishlist.length} product
                    {wishlist.length !== 1 ? "s" : ""}
                </p>

            </div>


            {wishlist.length === 0 ? (

                <div className="wishlist-empty">

                    <FaHeart />

                    <h3>
                        Your wishlist is empty
                    </h3>

                    <p>
                        Save products you love
                        and view them here later.
                    </p>

                    <Link
                        to="/products"
                        className="wishlist-shop-btn"
                    >
                        Browse Products
                    </Link>

                </div>

            ) : (

                <div className="wishlist-grid">

                    {wishlist.map((item) => (

                        <div
                            className="wishlist-card"
                            key={item.productId}
                        >

                            <Link
                                to={`/products/${item.productId}`}
                            >

                                <img
                                    src={getImageUrl(item.imageUrl)}
                                    alt={item.name}
                                />

                            </Link>


                            <div className="wishlist-info">

                                <h4>
                                    {item.name}
                                </h4>

                                <p>
                                    ₹{item.price}
                                </p>

                            </div>


                            <button
                                className="wishlist-remove-btn"
                                onClick={() =>
                                    handleRemove(item.productId)
                                }
                                title="Remove from wishlist"
                            >

                                <FaTrash />

                            </button>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}


export default Wishlist;