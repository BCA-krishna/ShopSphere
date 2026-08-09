import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaBoxOpen,
    FaShoppingCart,
    FaUsers,
    FaArrowRight,
    FaMoneyBillWave,
    FaClock,
    FaTags
} from "react-icons/fa";

import { getDashboard } from "../../services/dashboardService";
import "./Dashboard.css";

function Dashboard() {

    const [dashboard, setDashboard] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {

        try {

            const response = await getDashboard();

            setDashboard(response.data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    const today = new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });

    const stats = [
        {
            label: "Total Users",
            value: dashboard.totalUsers,
            icon: <FaUsers />,
            tone: "signal"
        },
        {
            label: "Total Products",
            value: dashboard.totalProducts,
            icon: <FaBoxOpen />,
            tone: "emerald"
        },
        {
            label: "Total Orders",
            value: dashboard.totalOrders,
            icon: <FaShoppingCart />,
            tone: "coral"
        },
        {
            label: "Total Revenue",
            value: `₹${dashboard.totalRevenue.toLocaleString("en-IN")}`,
            icon: <FaMoneyBillWave />,
            tone: "amber"
        }
    ];

    const panels = [
        {
            title: "Products",
            description: "Add, edit, and track stock across your catalogue.",
            icon: <FaBoxOpen />,
            tone: "emerald",
            link: "/admin/products",
            button: "Manage products"
        },
        {
            title: "Orders",
            description: "Review order status and move fulfilment forward.",
            icon: <FaShoppingCart />,
            tone: "coral",
            link: "/admin/orders",
            button: "Manage orders"
        },
        {
            title: "Users",
            description: "Look up accounts and manage customer access.",
            icon: <FaUsers />,
            tone: "signal",
            link: "/admin/users",
            button: "Manage users"
        },
        {
            title: "Coupons",
            icon: <FaTags size={40} />,
            color: "warning",
            link: "/admin/coupons",
            button: "Manage Coupons"
        }
    ];

    return (

        <div className="deck">

            <header className="deck-header">

                <div>
                    <p className="deck-eyebrow">ShopSphere / Admin</p>
                    <h1 className="deck-title">Control Deck</h1>
                </div>

                <div className="deck-status">
                    <span className="deck-live-dot" aria-hidden="true"></span>
                    <span>{today}</span>
                </div>

            </header>

            <section className="deck-stats" aria-label="Store overview">

                {stats.map((stat) => (

                    <div className={`stat-card tone-${stat.tone}`} key={stat.label}>

                        <div className="stat-top">
                            <span className="stat-label">{stat.label}</span>
                            <span className="stat-icon">{stat.icon}</span>
                        </div>

                        <p className="stat-value">
                            {loading ? "—" : stat.value}
                        </p>

                    </div>

                ))}

            </section>

            <section className="deck-panels" aria-label="Management sections">

                {panels.map((panel) => (

                    <Link to={panel.link} className={`panel-card tone-${panel.tone}`} key={panel.title}>

                        <span className="panel-icon">{panel.icon}</span>

                        <h3 className="panel-title">{panel.title}</h3>

                        <p className="panel-description">{panel.description}</p>

                        <span className="panel-cta">
                            {panel.button}
                            <FaArrowRight aria-hidden="true" />
                        </span>

                    </Link>

                ))}

            </section>

            <section
                className={`deck-alert ${dashboard.pendingOrders > 0 ? "is-active" : ""}`}
                aria-label="Pending orders"
            >

                <FaClock aria-hidden="true" className="deck-alert-icon" />

                <div>
                    <p className="deck-alert-value">
                        {loading ? "—" : dashboard.pendingOrders}
                    </p>
                    <p className="deck-alert-label">
                        {dashboard.pendingOrders === 1 ? "order awaiting action" : "orders awaiting action"}
                    </p>
                </div>

                <Link to="/admin/orders" className="deck-alert-link">
                    Review now
                    <FaArrowRight aria-hidden="true" />
                </Link>

            </section>

        </div>

    );
}

export default Dashboard;
