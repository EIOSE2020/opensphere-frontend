// js/profile.js
// ===== GESTION DU PROFIL =====

// Profil utilisateur simulé
const profileData = {
    id: 'u1',
    name: 'Alexandre Martin',
    username: 'alexandre_web3',
    avatar: 'https://i.pravatar.cc/80?img=11',
    cover: null,
    bio: 'Passionné par le Web3, la DeFi et la décentralisation. Building the future 🚀',
    verified: true,
    followers: 1234,
    following: 567,
    posts: 89,
    wallet: '0x7F4a8B9C3D2E1F5A6B7C8D9E0F1A2B3C4D5E6F7G',
    joined: 'Janvier 2024',
    location: 'Paris, France',
    website: 'https://opensphere.io',
};

// Mettre à jour l'affichage du profil
function updateProfileUI() {
    // Profil dans la sidebar
    const nameEl = document.getElementById('displayName');
    const usernameEl = document.getElementById('displayUsername');
    const walletEl = document.getElementById('walletAddress');
    
    if (nameEl) nameEl.textContent = profileData.name;
    if (usernameEl) usernameEl.textContent = '@' + profileData.username;
    if (walletEl) walletEl.textContent = truncateWallet(profileData.wallet);
    
    // Mettre à jour les stats
    document.querySelectorAll('.stat-number').forEach(el => {
        const label = el.closest('div')?.querySelector('.stat-label');
        if (label) {
            const text = label.textContent;
            if (text === 'Abonnés') el.textContent = profileData.followers.toLocaleString();
            if (text === 'Abonnements') el.textContent = profileData.following.toLocaleString();
            if (text === 'Posts') el.textContent = profileData.posts.toLocaleString();
        }
    });
}

// Initialiser le profil
function initProfile() {
    updateProfileUI();
}

// Exporter
window.profileAPI = {
    profileData,
    updateProfileUI,
    initProfile,
};