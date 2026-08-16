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

const PAGE_SIZE = 20;

function Products() {

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortBy, setSortBy] = useState("default");
    const [currentPage, setCurrentPage] = useState(1);

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
            // Fetch the whole catalog once; pagination below is done
            // client-side since the search/category endpoints don't
            // support server-side paging.
            const response = await getAllProducts(0, 1000);
            if (requestId === requestIdRef.current) {
                setProducts(response.data.content);
                setCurrentPage(1);
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
                setCurrentPage(1);
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
                setCurrentPage(1);
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

    const totalPages = Math.max(1, Math.ceil(sortedProducts.length / PAGE_SIZE));

    const pageProducts = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return sortedProducts.slice(start, start + PAGE_SIZE);
    }, [sortedProducts, currentPage]);

    const handleSortChange = (value) => {
        setSortBy(value);
        setCurrentPage(1);
    };

    const goToPage = (page) => {
        const clamped = Math.min(Math.max(page, 1), totalPages);
        setCurrentPage(clamped);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

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
                            onChange={(e) => handleSortChange(e.target.value)}
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
                        <>
                            <div className="products-grid">
                                {pageProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="catalog-pagination">
                                    <button
                                        className="pagination-btn"
                                        onClick={() => goToPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Prev
                                    </button>

                                    {Array.from({ length: totalPages }).map((_, i) => {
                                        const page = i + 1;
                                        return (
                                            <button
                                                key={page}
                                                className={`pagination-btn ${currentPage === page ? "is-active" : ""}`}
                                                onClick={() => goToPage(page)}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}

                                    <button
                                        className="pagination-btn"
                                        onClick={() => goToPage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
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