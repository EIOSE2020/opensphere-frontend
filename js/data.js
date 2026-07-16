// js/data.js
// ===== GESTION DES DONNÉES AVEC API RÉELLE =====

const API_URL = 'https://opensphere-backend-0f92255e67dd.herokuapp.com/api';

// ===== UTILISATEURS =====

function getUser() {
    try {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    } catch (e) {
        return null;
    }
}

function saveUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

function getAuthToken() {
    return localStorage.getItem('authToken') || null;
}

// ===== POSTS =====

async function getPosts() {
    try {
        const response = await fetch(`${API_URL}/posts/feed`);
        const data = await response.json();
        if (data.success) {
            return data.posts || [];
        }
        return [];
    } catch (error) {
        console.error('❌ Erreur chargement posts:', error);
        return [];
    }
}

async function createPost(content, media = [], privacy = 'public', isNFT = false) {
    try {
        const token = getAuthToken();
        if (!token) {
            throw new Error('Non authentifié');
        }

        const response = await fetch(`${API_URL}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ content, media, privacy, isNFT })
        });
        const data = await response.json();
        if (data.success) {
            return data.post;
        }
        throw new Error(data.error || 'Erreur création post');
    } catch (error) {
        console.error('❌ Erreur création post:', error);
        throw error;
    }
}

async function likePost(postId) {
    try {
        const token = getAuthToken();
        if (!token) {
            throw new Error('Non authentifié');
        }

        const response = await fetch(`${API_URL}/posts/${postId}/like`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (data.success) {
            return { likes: data.likes, liked: data.liked };
        }
        throw new Error(data.error || 'Erreur like');
    } catch (error) {
        console.error('❌ Erreur like:', error);
        throw error;
    }
}

async function diamondPost(postId, amount = 0.01) {
    try {
        const token = getAuthToken();
        if (!token) {
            throw new Error('Non authentifié');
        }

        const response = await fetch(`${API_URL}/posts/${postId}/diamond`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ amount })
        });
        const data = await response.json();
        if (data.success) {
            return { diamonds: data.diamonds };
        }
        throw new Error(data.error || 'Erreur diamond');
    } catch (error) {
        console.error('❌ Erreur diamond:', error);
        throw error;
    }
}

// ===== AUTHENTIFICATION =====

async function register(email, username, password, displayName) {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, username, password, displayName })
        });
        const data = await response.json();
        if (data.success) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            return data;
        }
        throw new Error(data.error || 'Erreur inscription');
    } catch (error) {
        console.error('❌ Erreur inscription:', error);
        throw error;
    }
}

async function login(email, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (data.success) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            return data;
        }
        throw new Error(data.error || 'Erreur connexion');
    } catch (error) {
        console.error('❌ Erreur connexion:', error);
        throw error;
    }
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// ===== EXPORT =====
window.DataAPI = {
    getUser,
    saveUser,
    getAuthToken,
    getPosts,
    createPost,
    likePost,
    diamondPost,
    register,
    login,
    logout
};