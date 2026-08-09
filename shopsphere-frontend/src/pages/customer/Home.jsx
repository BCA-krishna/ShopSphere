import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaLaptop,
  FaTshirt,
  FaHome,
  FaMobileAlt,
  FaCookieBite,
  FaTags
} from "react-icons/fa";

import { getAllProducts, getCategories } from "../../services/productService";
import ProductCard from "../../components/ProductCard";
import "./Home.css";

const CATEGORY_ICONS = {
  electronics: FaLaptop,
  fashion: FaTshirt,
  home: FaHome,
  mobiles: FaMobileAlt,
  snacks: FaCookieBite,
  laptops: FaLaptop,
};

function getCategoryIcon(name) {
  const key = name?.toLowerCase();
  return CATEGORY_ICONS[key] || FaTags;
}

function Home() {

  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [productsError, setProductsError] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setProductsLoading(true);
    setProductsError(false);
    try {
      const response = await getAllProducts();
      setProducts(response.data.content ?? []);
    } catch (error) {
      console.error(error);
      setProductsError(true);
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const response = await getCategories();
      setCategories(response.data ?? []);
    } catch (error) {
      console.error(error);
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  const featuredProducts = products.slice(0, 8);

  const visibleCategories = categories
    .filter((cat) => cat !== "All")
    .slice(0, 8);

  return (
    <>

      {/* Banner */}

      <section className="market-hero">

        <div className="market-hero-inner">

          <span className="hero-pennant">Summer Sale</span>

          <h2 className="hero-headline">
            Up to <span className="hero-percent">50%</span> off
          </h2>

          <p className="hero-sub">
            Fresh markdowns across every stall, today only.
          </p>

          <Link to="/products" className="hero-cta">
            Shop now
          </Link>

        </div>

      </section>

      {/* Categories */}

      <div className="container market-section">

        <h3 className="market-section-title">
          Shop by category
        </h3>

        {categoriesLoading ? (

          <div className="category-rail">
            {Array.from({ length: 8 }).map((_, i) => (
              <div className="category-chip category-chip-skeleton" key={i}>
                <div className="skeleton-circle" />
                <div className="skeleton-line-sm" />
              </div>
            ))}
          </div>

        ) : visibleCategories.length > 0 ? (

          <div className="category-rail">
            {visibleCategories.map((cat) => {
              const Icon = getCategoryIcon(cat);
              return (
                <button
                  type="button"
                  className="category-chip"
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                >
                  <span className="category-badge">
                    <Icon />
                  </span>
                  <h6>{cat}</h6>
                </button>
              );
            })}
          </div>

        ) : (

          <p className="market-empty">
            Categories aren't available right now.
          </p>

        )}

      </div>

      {/* Products */}

      <div className="container market-section market-section-last">

        <h3 className="market-section-title">
          Featured products
        </h3>

        {productsLoading ? (

          <div className="home-products-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div className="product-skeleton" key={i}>
                <div className="skeleton-img" />
                <div className="skeleton-line w-70" />
                <div className="skeleton-line w-40" />
              </div>
            ))}
          </div>

        ) : productsError ? (

          <div className="market-empty-card">
            <p>Couldn't load featured products.</p>
            <button
              type="button"
              className="market-retry-btn"
              onClick={fetchProducts}
            >
              Try again
            </button>
          </div>

        ) : featuredProducts.length > 0 ? (

          <div className="home-products-grid">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>

        ) : (

          <div className="market-empty-card">
            <p>No products to show yet. Check back soon.</p>
          </div>

        )}

      </div>

    </>
  );
}

export default Home;
