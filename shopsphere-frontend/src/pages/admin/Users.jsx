import { useEffect, useMemo, useState } from "react";
import {
    getAllUsers,
    deleteUser
} from "../../services/userService";
import "./Users.css";

function getInitials(user) {
    const first = user.firstName?.[0] || "";
    const last = user.lastName?.[0] || "";
    return (first + last).toUpperCase() || "?";
}

function Users() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [deletingId, setDeletingId] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        loadUsers();
    }, [page]);

    const loadUsers = async () => {

        try {

            setLoading(true);

            const response = await getAllUsers(page);

            setUsers(response.data.content);

            setTotalPages(response.data.totalPages);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    const filteredUsers = useMemo(() => {

        const query = search.trim().toLowerCase();

        if (!query) return users;

        return users.filter((user) => {
            const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.toLowerCase();
            return (
                fullName.includes(query) ||
                user.email?.toLowerCase().includes(query)
            );
        });

    }, [users, search]);

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmDelete) return;

        try {

            setDeletingId(id);

            await deleteUser(id);

            alert("User deleted successfully");

            loadUsers();

        } catch (error) {

            console.error(error);

            alert("Failed to delete user");

        } finally {

            setDeletingId(null);

        }

    };

    return (

        <div className="usr-page">

            <header className="usr-header">

                <div>
                    <p className="usr-eyebrow">ShopSphere / Admin</p>
                    <h1 className="usr-title">Manage users</h1>
                </div>

                <input
                    type="text"
                    className="usr-search"
                    placeholder="Search by name or email…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

            </header>

            <div className="usr-table-card">

                {loading ? (

                    <p className="usr-empty">Loading users…</p>

                ) : filteredUsers.length === 0 ? (

                    <p className="usr-empty">
                        {users.length === 0
                            ? "No users yet."
                            : "No users match your search."}
                    </p>

                ) : (

                    <div className="usr-table-scroll">

                        <table className="usr-table">

                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th className="usr-th-actions">Action</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredUsers.map((user) => (

                                    <tr key={user.id}>

                                        <td>
                                            <div className="usr-name-cell">
                                                <span className="usr-avatar">
                                                    {getInitials(user)}
                                                </span>
                                                <div>
                                                    <p className="usr-name">
                                                        {user.firstName} {user.lastName}
                                                    </p>
                                                    <p className="usr-id">#{user.id}</p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="usr-email">{user.email}</td>

                                        <td>
                                            <span
                                                className={`usr-role-pill ${
                                                    user.role === "ADMIN" ? "tone-admin" : "tone-user"
                                                }`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>

                                        <td className="usr-actions-cell">

                                            {user.role !== "ADMIN" && (

                                                <button
                                                    className="usr-delete-btn"
                                                    onClick={() => handleDelete(user.id)}
                                                    disabled={deletingId === user.id}
                                                >
                                                    {deletingId === user.id ? "Deleting…" : "Delete"}
                                                </button>

                                            )}

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

            {!loading && totalPages > 1 && (

                <div className="usr-pagination">

                    <button
                        className="usr-page-btn"
                        disabled={page === 0}
                        onClick={() => setPage((p) => p - 1)}
                    >
                        Previous
                    </button>

                    <span className="usr-page-info">
                        Page {page + 1} of {totalPages}
                    </span>

                    <button
                        className="usr-page-btn"
                        disabled={page + 1 >= totalPages}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Next
                    </button>

                </div>

            )}

        </div>

    );
}

export default Users;