import { API_BASE_URL } from "../api/axiosConfig";

/**
 * Builds the full URL for a product image.
 *
 * Newer products store imageUrl as "/uploads/filename.jpg" (see ProductService).
 * Older products (created before that change) may still have just
 * "filename.jpg" saved in the database with no leading slash — handle both
 * so old rows don't render as ".../onrender.comfilename.jpg".
 */
export function getImageUrl(imageUrl, fallback = "https://via.placeholder.com/300x300?text=No+Image") {
    if (!imageUrl) return fallback;

    // Already a full URL (e.g. someone pasted an external image link)
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
        return imageUrl;
    }

    // Normalize to always have exactly one leading slash before "uploads/"
    const path = imageUrl.startsWith("/uploads/")
        ? imageUrl
        : imageUrl.startsWith("/")
            ? `/uploads${imageUrl}`
            : `/uploads/${imageUrl}`;

    return `${API_BASE_URL}${path}`;
}