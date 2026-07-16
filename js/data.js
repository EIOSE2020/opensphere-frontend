// js/data.js
// ===== DONNÉES MOCKÉES AVEC PERSISTANCE LOCALSTORAGE =====

// Utilisateurs mockés
const MOCK_USERS = [
    { id: 'u1', name: 'Alexandre Martin', username: 'alexandre_web3', avatar: 'https://i.pravatar.cc/40?img=11', verified: true, bio: 'Passionné par le Web3 🚀' },
    { id: 'u2', name: 'Sophie Dubois', username: 'sophie_dao', avatar: 'https://i.pravatar.cc/40?img=1', verified: true, bio: 'Building the future of DAOs' },
    { id: 'u3', name: 'Thomas Bernard', username: 'thomas_nft', avatar: 'https://i.pravatar.cc/40?img=3', verified: false, bio: 'NFT Artist & Collector' },
    { id: 'u4', name: 'Emma Rousseau', username: 'emma_crypto', avatar: 'https://i.pravatar.cc/40?img=5', verified: true, bio: 'DeFi Enthusiast' },
    { id: 'u5', name: 'Lucas Moreau', username: 'lucas_defi', avatar: 'https://i.pravatar.cc/40?img=7', verified: false, bio: 'Crypto since 2017' },
    { id: 'u6', name: 'Julie Petit', username: 'julie_web3', avatar: 'https://i.pravatar.cc/40?img=9', verified: true, bio: 'Web3 Community Builder' },
];

// Posts mockés initiaux
const MOCK_POSTS = [
    {
        id: 'p1',
        userId: 'u1',
        content: '🚀 OpenSphere est officiellement en bêta ! Rejoignez le futur des réseaux sociaux décentralisés.\n\nPropriété de vos données, transactions sans gaz, et tokenomique intégrée. #Web3 #OpenSphere',
        media: null,
        isNFT: false,
        timestamp: Date.now() - 1000 * 60 * 15,
        likes: 42,
        comments: 12,
        shares: 7,
        diamonds: 23,
        liked: false,
        diamonded: false,
    },
    {
        id: 'p2',
        userId: 'u2',
        content: '🎨 La communauté des artistes NFT grandit de jour en jour. Qui est chaud pour un collab ?',
        media: 'https://picsum.photos/seed/nft/600/400',
        isNFT: true,
        timestamp: Date.now() - 1000 * 60 * 45,
        likes: 28,
        comments: 8,
        shares: 4,
        diamonds: 15,
        liked: false,
        diamonded: false,
    },
    {
        id: 'p3',
        userId: 'u3',
        content: '💡 La DeFi redéfinit la finance. Prêt pour la prochaine vague ? #DeFi #Crypto',
        media: null,
        isNFT: false,
        timestamp: Date.now() - 1000 * 60 * 120,
        likes: 15,
        comments: 5,
        shares: 2,
        diamonds: 8,
        liked: true,
        diamonded: false,
    },
    {
        id: 'p4',
        userId: 'u4',
        content: '🌍 La décentralisation n\'est pas qu\'une technologie, c\'est une philosophie. Rejoignez le mouvement. #DAO',
        media: 'https://picsum.photos/seed/dao/600/400',
        isNFT: false,
        timestamp: Date.now() - 1000 * 60 * 180,
        likes: 56,
        comments: 18,
        shares: 12,
        diamonds: 34,
        liked: false,
        diamonded: true,
    },
    {
        id: 'p5',
        userId: 'u5',
        content: '📈 Le marché crypto repart à la hausse ! Partagez vos prédictions pour les prochains mois. #Crypto #BullRun',
        media: null,
        isNFT: false,
        timestamp: Date.now() - 1000 * 60 * 300,
        likes: 33,
        comments: 22,
        shares: 9,
        diamonds: 11,
        liked: false,
        diamonded: false,
    },
    {
        id: 'p6',
        userId: 'u6',
        content: '🔥 Nouveau projet communautaire ! Un DAO dédié aux créateurs. Rejoignez-nous ! #DAO #Community #Web3',
        media: 'https://picsum.photos/seed/dao2/600/400',
        isNFT: true,
        timestamp: Date.now() - 1000 * 60 * 400,
        likes: 47,
        comments: 14,
        shares: 6,
        diamonds: 19,
        liked: false,
        diamonded: false,
    },
];

// Fonctions de persistance
function getPosts() {
    const stored = localStorage.getItem('opensphere_posts');
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            return MOCK_POSTS;
        }
    }
    localStorage.setItem('opensphere_posts', JSON.stringify(MOCK_POSTS));
    return MOCK_POSTS;
}

function savePosts(posts) {
    localStorage.setItem('opensphere_posts', JSON.stringify(posts));
}

function getUser() {
    const stored = localStorage.getItem('user');
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            return null;
        }
    }
    return null;
}

function getUsers() {
    const stored = localStorage.getItem('opensphere_users');
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            return MOCK_USERS;
        }
    }
    localStorage.setItem('opensphere_users', JSON.stringify(MOCK_USERS));
    return MOCK_USERS;
}

function saveUsers(users) {
    localStorage.setItem('opensphere_users', JSON.stringify(users));
}

// Exporter
window.DataAPI = {
    getPosts,
    savePosts,
    getUser,
    getUsers,
    saveUsers,
    MOCK_USERS,
    MOCK_POSTS,
};