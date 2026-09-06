import { useLocation, NavLink, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import { FiMic, FiMenu, FiX, FiSearch } from "react-icons/fi";

import { useAuth } from "../hooks/useAuth";
import { useScrollDirection } from "../hooks/useScrollDirection";

import "./Navbar.css";

function Navbar() {

    const navigate = useNavigate();
    const location = useLocation();

    const { token, role, logout } = useAuth();

    const [query, setQuery] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const recognitionRef = useRef(null);

    const isAuthPage =
        location.pathname === "/login" ||
        location.pathname === "/register";

    const isHidden =
        useScrollDirection() && !menuOpen;


    useEffect(() => {

        setMenuOpen(false);

    }, [location.pathname]);


    useEffect(() => {

        return () => {

            recognitionRef.current?.stop();

        };

    }, []);


    const handleLogout = () => {

        logout();

        setMenuOpen(false);

        navigate("/login");

    };


    const handleSearch = (e) => {

        e.preventDefault();

        const keyword = query.trim();

        if (!keyword) return;

        setMenuOpen(false);

        navigate(
            `/products?search=${encodeURIComponent(keyword)}`
        );

    };


    const startVoiceSearch = useCallback(() => {

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!SpeechRecognition) {

            alert(
                "Voice search is not supported in this browser."
            );

            return;

        }


        const recognition =
            new SpeechRecognition();

        recognitionRef.current =
            recognition;

        recognition.lang =
            "en-IN";

        recognition.continuous =
            false;

        recognition.interimResults =
            false;


        recognition.onstart = () => {

            setIsListening(true);

        };


        recognition.onend = () => {

            setIsListening(false);

        };


        recognition.onresult =
            (event) => {

                const spokenText =
                    event.results[0][0].transcript;

                setQuery(spokenText);

                navigate(
                    `/products?search=${encodeURIComponent(
                        spokenText
                    )}`
                );

                setMenuOpen(false);

            };


        recognition.onerror =
            (event) => {

                console.error(
                    "Voice search error:",
                    event.error
                );

                setIsListening(false);

            };


        recognition.start();

    }, [navigate]);


    const navLinkClass =
        ({ isActive }) =>
            isActive
                ? "nav-link active"
                : "nav-link";


    return (

        <header
            className={`navbar-wrapper ${
                isHidden
                    ? "navbar-hidden"
                    : ""
            }`}
        >

            <nav className="navbar-custom">


                {/* LOGO */}

                <Link
                    to="/"
                    className="logo"
                    onClick={() =>
                        setMenuOpen(false)
                    }
                >
                    ShopSphere
                </Link>


                {/* DESKTOP SEARCH */}

                {!isAuthPage && (

                    <form
                        className="desktop-search"
                        onSubmit={handleSearch}
                    >

                        <div
                            className="search-input-wrapper"
                        >

                            <FiSearch
                                className="search-icon"
                            />

                            <input
                                type="text"
                                placeholder="Search products..."
                                value={query}
                                onChange={(e) =>
                                    setQuery(
                                        e.target.value
                                    )
                                }
                            />


                            <button
                                type="button"
                                className={`voice-search-btn ${
                                    isListening
                                        ? "is-listening"
                                        : ""
                                }`}
                                onClick={
                                    startVoiceSearch
                                }
                                disabled={
                                    isListening
                                }
                                title="Voice search"
                            >

                                <FiMic />

                            </button>

                        </div>


                        <button
                            type="submit"
                            className="search-btn"
                        >

                            Search

                        </button>

                    </form>

                )}


                {/* DESKTOP NAVIGATION */}

                <div className="desktop-nav">

                    <NavLink
                        to="/"
                        className={
                            navLinkClass
                        }
                    >
                        Home
                    </NavLink>


                    <NavLink
                        to="/products"
                        className={
                            navLinkClass
                        }
                    >
                        Products
                    </NavLink>


                    {token &&
                        role === "CUSTOMER" && (
                            <>

                                <NavLink
                                    to="/cart"
                                    className={
                                        navLinkClass
                                    }
                                >
                                    Cart
                                </NavLink>


                                <NavLink
                                    to="/wishlist"
                                    className={
                                        navLinkClass
                                    }
                                >
                                    Wishlist
                                </NavLink>


                                <NavLink
                                    to="/orders"
                                    className={
                                        navLinkClass
                                    }
                                >
                                    Orders
                                </NavLink>

                            </>
                        )}


                    {token &&
                        role === "ADMIN" && (

                            <NavLink
                                to="/admin"
                                className={
                                    navLinkClass
                                }
                            >
                                Dashboard
                            </NavLink>

                        )}

                </div>


                {/* DESKTOP ACTIONS */}

                <div className="desktop-actions">

                    {!token ? (

                        <>

                            <Link
                                to="/login"
                                className="login-btn"
                            >
                                Login
                            </Link>


                            <Link
                                to="/register"
                                className="register-btn"
                            >
                                Register
                            </Link>

                        </>

                    ) : (

                        <button
                            className="logout-btn"
                            onClick={
                                handleLogout
                            }
                        >
                            Logout
                        </button>

                    )}

                </div>


                {/* MOBILE HAMBURGER */}

                <button
                    className="mobile-menu-toggle"
                    onClick={() =>
                        setMenuOpen(
                            (open) => !open
                        )
                    }
                    aria-label="Toggle menu"
                >

                    {menuOpen
                        ? <FiX />
                        : <FiMenu />
                    }

                </button>


                {/* MOBILE MENU */}

                <div
                    className={`mobile-menu ${
                        menuOpen
                            ? "open"
                            : ""
                    }`}
                >


                    {/* MOBILE SEARCH */}

                    {!isAuthPage && (

                        <form
                            className="mobile-search"
                            onSubmit={
                                handleSearch
                            }
                        >

                            <div
                                className="search-input-wrapper"
                            >

                                <FiSearch
                                    className="search-icon"
                                />

                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={
                                        query
                                    }
                                    onChange={(e) =>
                                        setQuery(
                                            e.target.value
                                        )
                                    }
                                />


                                <button
                                    type="button"
                                    className={`voice-search-btn ${
                                        isListening
                                            ? "is-listening"
                                            : ""
                                    }`}
                                    onClick={
                                        startVoiceSearch
                                    }
                                >

                                    <FiMic />

                                </button>

                            </div>


                            <button
                                type="submit"
                                className="search-btn"
                            >
                                Search
                            </button>

                        </form>

                    )}


                    <div
                        className="mobile-links"
                    >

                        <NavLink
                            to="/"
                            className={
                                navLinkClass
                            }
                        >
                            Home
                        </NavLink>


                        <NavLink
                            to="/products"
                            className={
                                navLinkClass
                            }
                        >
                            Products
                        </NavLink>


                        {token &&
                            role === "CUSTOMER" && (
                                <>

                                    <NavLink
                                        to="/cart"
                                        className={
                                            navLinkClass
                                        }
                                    >
                                        Cart
                                    </NavLink>


                                    <NavLink
                                        to="/wishlist"
                                        className={
                                            navLinkClass
                                        }
                                    >
                                        Wishlist
                                    </NavLink>


                                    <NavLink
                                        to="/orders"
                                        className={
                                            navLinkClass
                                        }
                                    >
                                        Orders
                                    </NavLink>

                                </>
                            )}


                        {token &&
                            role === "ADMIN" && (

                                <NavLink
                                    to="/admin"
                                    className={
                                        navLinkClass
                                    }
                                >
                                    Dashboard
                                </NavLink>

                            )}

                    </div>


                    <div
                        className="mobile-actions"
                    >

                        {!token ? (

                            <>

                                <Link
                                    to="/login"
                                    className="login-btn"
                                >
                                    Login
                                </Link>


                                <Link
                                    to="/register"
                                    className="register-btn"
                                >
                                    Register
                                </Link>

                            </>

                        ) : (

                            <button
                                className="logout-btn"
                                onClick={
                                    handleLogout
                                }
                            >
                                Logout
                            </button>

                        )}

                    </div>

                </div>


            </nav>

        </header>

    );

}

export default Navbar;