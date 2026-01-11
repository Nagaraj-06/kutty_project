const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

/**
 * Ensures the image URL is correctly prefixed if it's a relative path from the backend.
 * @param {string} path - The stored image path (e.g., '/assets/...')
 * @param {string} fallback - The default image to return if path is null/empty
 * @returns {string} - The corrected absolute URL or the fallback
 */
export const getImageUrl = (path, fallback) => {
    if (!path) return fallback;
    if (path.startsWith("/assets")) {
        return `${API_URL}${path}`;
    }
    return path;
};

export { API_URL };
