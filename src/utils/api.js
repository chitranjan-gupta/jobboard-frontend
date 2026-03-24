// src/utils/api.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Parses the JWT to check if it has expired.
 * @param {string} token - The JWT string.
 * @returns {boolean} - True if valid, false if expired or invalid.
 */
export const isTokenValid = (token) => {
    if (!token) return false;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 > Date.now();
    } catch {
        return false;
    }
};

/**
 * A custom wrapper around window.fetch that automatically handles:
 * 1. Injecting the Authorization Bearer block.
 * 2. Catching 401 Unauthorized responses.
 * 3. Attempting to rotate the access token using the refresh token.
 * 4. Retrying the original failed request.
 * 
 * @param {string} url - The API endpoint to call (relative to API_BASE_URL or absolute).
 * @param {object} options - Standard fetch options (method, headers, body, etc.).
 * @returns {Promise<Response>} - Resolves to the fetch Response.
 */
export const fetchWithAuth = async (url, options = {}) => {
    // 1. Prepare Request Data
    let user = null;
    try {
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                user = JSON.parse(storedUser);
            }
        }
    } catch (e) { /* ignore parse errors */ }

    // Ensure absolute URL
    // If url starts with http, leave it. Otherwise prepend base URL.
    const baseUrl = API_BASE_URL;
    const finalUrl = url.startsWith('http') ? url : `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;

    const headers = new Headers(options.headers || {});

    // Default content type to JSON if not specified and not FormData
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }

    // Attempt to inject token. We proactively check if the access token is valid 
    // to avoid an unnecessary round trip if we *know* it's expired.
    if (user?.access) {
        if (!isTokenValid(user.access) && user.refresh) {
            console.warn('Access token proactively detected as expired; attempting refresh before request...');
            // Need to refresh before even sending the initial request
            const newAccess = await refreshAccessToken(user);
            if (newAccess) {
                user.access = newAccess;
                headers.set('Authorization', `Bearer ${newAccess}`);
            } else {
                // Refresh failed
                forceLogout();
                throw new Error('Session expired');
            }
        } else {
            // Still nominally valid (or no refresh logic handling here)
            headers.set('Authorization', `Bearer ${user.access}`);
        }
    }

    // 2. Initial Fetch Attempt
    let response;
    try {
        response = await fetch(finalUrl, { ...options, headers });
    } catch (networkError) {
        console.warn(`[Network Error] Failed to reach API at ${finalUrl}:`, networkError.message);
        throw new Error('Backend server is unreachable. Please check your network connection.');
    }

    // 3. Handle 401 Unauthorized (Catch edge cases where token was revoked server-side)
    if (response.status === 401 && user?.refresh) {
        console.warn('401 Unauthorized received. Attempting reactive refresh...');

        const newAccess = await refreshAccessToken(user);

        if (newAccess) {
            // Retry the original request with the *new* token!
            headers.set('Authorization', `Bearer ${newAccess}`);
            try {
                response = await fetch(finalUrl, { ...options, headers });
            } catch (retryError) {
                 throw new Error('Backend server is unreachable during token refresh.');
            }
        } else {
            // Unrecoverable
            forceLogout();
        }
    }

    // Return the response
    return response;
};

// --- Helpers ---

const refreshAccessToken = async (user) => {
    try {
        const refreshResponse = await fetch(`${API_BASE_URL}/token/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: user.refresh }),
        });

        if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();

            // Update Local Storage with the new access token
            user.access = refreshData.access;
            if (refreshData.refresh) {
                user.refresh = refreshData.refresh;
            }
            localStorage.setItem('user', JSON.stringify(user));

            // Dispatch a custom event so other contexts (like AuthContext state) can sync
            window.dispatchEvent(new CustomEvent('token-refreshed', { detail: user }));

            return user.access;
        } else {
            console.error('Refresh token is invalid or expired.');
            return null;
        }
    } catch (refreshErr) {
        console.error('Network error during token refresh.', refreshErr);
        return null;
    }
};

const forceLogout = () => {
    console.warn('Forcing unrecoverable session logout via API Wrapper.');
    localStorage.removeItem('user');
    // Using simple reload or redirect that the layout will catch
    window.location.reload(); 
};
