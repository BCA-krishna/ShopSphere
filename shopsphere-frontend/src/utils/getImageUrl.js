import { API_BASE_URL } from "../api/axiosConfig";

/**
 * Builds the full URL for a product image.
 *
 * product.imageUrl is stored by the backend as "/uploads/filename.jpg"
 * (see ProductService), so we just prepend the backend host — no extra
 * "/uploads/" here, or you'll get a double path like
 * ".../uploads/uploads/filename.jpg".
 */
export function getImageUrl(imageUrl, fallback = "https://via.placeholder.com/300x300?text=No+Image") {
    if (!imageUrl) return fallback;
    return `${API_BASE_URL}${imageUrl}`;
}