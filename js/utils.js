// js/utils.js
// ===== UTILITAIRES =====

// Formatage des dates
function formatTimeAgo(date) {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return 'à l\'instant';
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}j`;
    return date.toLocaleDateString('fr-FR');
}

// Tronquer une adresse wallet
function truncateWallet(address) {
    if (!address) return '';
    if (address.length < 20) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Générer un ID aléatoire
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

// Échapper le HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Afficher un toast
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) {
        // Créer le conteneur s'il n'existe pas
        const newContainer = document.createElement('div');
        newContainer.className = 'toast-container';
        newContainer.id = 'toastContainer';
        document.body.appendChild(newContainer);
        return showToast(message, type);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `
        <i class="fas ${icons[type] || icons.info}"></i>
        <span class="toast-message">${message}</span>
        <button class="toast-close">&times;</button>
    `;
    
    container.appendChild(toast);
    
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    });
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }
    }, 5000);
}

// Debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== GESTION DE L'AUTHENTIFICATION =====

/**
 * Vérifier si l'utilisateur est connecté
 * @returns {Object|null} L'utilisateur connecté ou null
 */
function isUserLoggedIn() {
    try {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    } catch (e) {
        return null;
    }
}

/**
 * Déconnecter l'utilisateur
 */
function logoutUser() {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    showToast('Déconnexion réussie', 'info');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 500);
}

/**
 * Rediriger vers la page de connexion si non connecté
 * @returns {boolean} True si connecté, false sinon
 */
function requireAuth() {
    const user = isUserLoggedIn();
    if (!user) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

/**
 * Obtenir le token d'authentification
 * @returns {string|null} Le token JWT ou null
 */
function getAuthToken() {
    return localStorage.getItem('authToken') || null;
}

/**
 * Définir les informations de l'utilisateur après connexion
 * @param {Object} userData - Données de l'utilisateur
 * @param {string} token - Token JWT
 */
function setUserSession(userData, token) {
    localStorage.setItem('user', JSON.stringify(userData));
    if (token) {
        localStorage.setItem('authToken', token);
    }
    showToast(`Bienvenue ${userData.displayName || userData.username || 'Utilisateur'} !`, 'success');
}

/**
 * Mettre à jour les informations de l'utilisateur
 * @param {Object} userData - Nouvelles données
 */
function updateUserSession(userData) {
    const currentUser = isUserLoggedIn();
    if (currentUser) {
        const updatedUser = { ...currentUser, ...userData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
    }
}