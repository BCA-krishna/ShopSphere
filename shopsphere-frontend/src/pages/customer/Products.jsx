import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiSearch, FiPackage } from "react-icons/fi";
import {
    getAllProducts,
    searchProducts,
    getProductsByCategory,
    getCategories
} from "../../services/productService";
import ProductCard from "../../components/ProductCard";
import "./Products.css";

function Products() {

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortBy, setSortBy] = useState("default");

    const [searchParams] = useSearchParams();

    const debounceRef = useRef(null);
    const requestIdRef = useRef(0);

    const [categories, setCategories] = useState([]);

    useEffect(() => {

        fetchCategories();

        const keyword = searchParams.get("search");

        if (keyword) {
            setSearch(keyword);
            setSelectedCategory("All");
            fetchSearchProducts(keyword);
        } else {
            fetchProducts();
        }

        return () => clearTimeout(debounceRef.current);

    }, [searchParams]);

    const fetchProducts = async () => {
        const requestId = ++requestIdRef.current;
        setLoading(true);
        try {
            const response = await getAllProducts();
            if (requestId === requestIdRef.current) {
                setProducts(response.data.content);
            }
        } catch (error) {
            console.error(error);
        } finally {
            if (requestId === requestIdRef.current) setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await getCategories();
            setCategories(["All", ...response.data]);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchSearchProducts = async (keyword) => {
        const requestId = ++requestIdRef.current;
        setLoading(true);
        try {
            const response = await searchProducts(keyword);
            if (requestId === requestIdRef.current) {
                setProducts(response.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            if (requestId === requestIdRef.current) setLoading(false);
        }
    };

    const fetchCategoryProducts = async (category) => {
        if (category === "All") {
            await fetchProducts();
            return;
        }

        const requestId = ++requestIdRef.current;
        setLoading(true);
        try {
            const response = await getProductsByCategory(category);
            if (requestId === requestIdRef.current) {
                setProducts(response.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            if (requestId === requestIdRef.current) setLoading(false);
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        setSelectedCategory("All");

        clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            if (value.trim() === "") {
                fetchProducts();
            } else {
                fetchSearchProducts(value.trim());
            }
        }, 400);
    };

    const handleCategoryClick = (cat) => {
        setSelectedCategory(cat);
        setSearch("");
        clearTimeout(debounceRef.current);
        fetchCategoryProducts(cat);
    };

    const sortedProducts = useMemo(() => {
        return [...products].sort((a, b) => {
            if (sortBy === "low") return a.price - b.price;
            if (sortBy === "high") return b.price - a.price;
            if (sortBy === "name") return a.name.localeCompare(b.name);
            return 0;
        });
    }, [products, sortBy]);

    return (
        <div className="catalog-page">

            <div className="catalog-header">

                <div>
                    <h2 className="catalog-title">All products</h2>
                    <p className="catalog-count">{products.length} product{products.length === 1 ? "" : "s"}</p>
                </div>

                <div className="catalog-search">
                    <FiSearch className="catalog-search-icon" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="catalog-search-input"
                        value={search}
                        onChange={handleSearch}
                    />
                </div>

            </div>

            <div className="catalog-body">

                {/* Sidebar */}
                <aside className="catalog-sidebar">

                    <div className="sidebar-block">

                        <h5 className="sidebar-heading">Categories</h5>

                        <div className="category-pill-list">

                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    className={`category-pill ${selectedCategory === cat ? "is-active" : ""}`}
                                    onClick={() => handleCategoryClick(cat)}
                                >
                                    {cat}
                                </button>
                            ))}

                        </div>

                    </div>

                    <div className="sidebar-block">

                        <h5 className="sidebar-heading">Sort by</h5>

                        <select
                            className="sidebar-select"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="default">Default</option>
                            <option value="low">Price: Low to High</option>
                            <option value="high">Price: High to Low</option>
                            <option value="name">Name: A-Z</option>
                        </select>

                    </div>

                </aside>

                {/* Products */}
                <div className="catalog-content">

                    {loading ? (
                        <div className="products-grid">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div className="product-skeleton" key={i}>
                                    <div className="skeleton-img" />
                                    <div className="skeleton-line w-70" />
                                    <div className="skeleton-line w-40" />
                                </div>
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <div className="products-grid">
                            {sortedProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="products-empty">
                            <FiPackage className="products-empty-icon" />
                            <h4>No products found</h4>
                            <p>Try a different search term or check back later.</p>
                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}

export default Products;
