// js/posts.js
// ===== GESTION DES POSTS =====

// Données mockées
const mockUsers = [
    { id: 'u1', name: 'Alexandre Martin', username: 'alexandre_web3', avatar: 'https://i.pravatar.cc/40?img=11', verified: true },
    { id: 'u2', name: 'Sophie Dubois', username: 'sophie_dao', avatar: 'https://i.pravatar.cc/40?img=1', verified: true },
    { id: 'u3', name: 'Thomas Bernard', username: 'thomas_nft', avatar: 'https://i.pravatar.cc/40?img=3', verified: false },
    { id: 'u4', name: 'Emma Rousseau', username: 'emma_crypto', avatar: 'https://i.pravatar.cc/40?img=5', verified: true },
    { id: 'u5', name: 'Lucas Moreau', username: 'lucas_defi', avatar: 'https://i.pravatar.cc/40?img=7', verified: false },
    { id: 'u6', name: 'Julie Petit', username: 'julie_web3', avatar: 'https://i.pravatar.cc/40?img=9', verified: true },
];

const mockPosts = [
    {
        id: 'p1',
        userId: 'u1',
        content: '🚀 OpenSphere est officiellement en bêta ! Rejoignez le futur des réseaux sociaux décentralisés. #Web3 #OpenSphere',
        media: null,
        isNFT: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
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
        content: '🎨 La communauté des artistes NFT grandit de jour en jour. Qui est chaud pour un collab ? #NFT #Art #Web3',
        media: 'https://picsum.photos/seed/nft/600/400',
        isNFT: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
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
        content: '💡 La DeFi redéfinit la finance. Prêt pour la prochaine vague ? #DeFi #Crypto #Innovation',
        media: null,
        isNFT: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 120),
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
        content: '🌍 La décentralisation n\'est pas qu\'une technologie, c\'est une philosophie. Rejoignez le mouvement. #DAO #Decentralization',
        media: 'https://picsum.photos/seed/dao/600/400',
        isNFT: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 180),
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
        timestamp: new Date(Date.now() - 1000 * 60 * 300),
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
        timestamp: new Date(Date.now() - 1000 * 60 * 400),
        likes: 47,
        comments: 14,
        shares: 6,
        diamonds: 19,
        liked: false,
        diamonded: false,
    },
];

let posts = [...mockPosts];
let currentFilter = 'all';
let postCounter = posts.length;

// Rendu d'un post
function renderPost(post) {
    const user = mockUsers.find(u => u.id === post.userId);
    if (!user) return '';
    
    const timeAgo = formatTimeAgo(post.timestamp);
    const mediaHTML = post.media ? `
        <div class="post-media">
            ${post.media.match(/\.(mp4|webm)$/) ? 
                `<video src="${post.media}" controls></video>` : 
                `<img src="${post.media}" alt="Post media" loading="lazy" />`
            }
        </div>
    ` : '';
    
    const nftBadge = post.isNFT ? `
        <div class="post-nft-badge">
            <i class="fas fa-crown"></i> NFT Collection
        </div>
    ` : '';
    
    const likedClass = post.liked ? 'liked' : '';
    const diamondedClass = post.diamonded ? 'diamonded' : '';
    
    return `
        <div class="post-card" data-post-id="${post.id}">
            <div class="post-header">
                <img src="${user.avatar}" alt="${user.name}" class="post-avatar" />
                <div class="post-user-info">
                    <div class="post-user-name">
                        ${user.name}
                        ${user.verified ? '<i class="fas fa-check-circle verified"></i>' : ''}
                        <span class="post-username">@${user.username}</span>
                        <span class="post-time">· ${timeAgo}</span>
                    </div>
                </div>
                <button class="post-more-btn" title="Plus d'options">
                    <i class="fas fa-ellipsis-h"></i>
                </button>
            </div>
            
            <div class="post-content">${escapeHtml(post.content)}</div>
            ${mediaHTML}
            ${nftBadge}
            
            <div class="post-actions-bar">
                <div class="post-action-group">
                    <button class="post-action-btn-social like-btn ${likedClass}" data-post-id="${post.id}">
                        <i class="fas fa-heart"></i>
                        <span class="count">${post.likes}</span>
                    </button>
                    <button class="post-action-btn-social" data-post-id="${post.id}">
                        <i class="fas fa-comment"></i>
                        <span class="count">${post.comments}</span>
                    </button>
                    <button class="post-action-btn-social" data-post-id="${post.id}">
                        <i class="fas fa-retweet"></i>
                        <span class="count">${post.shares}</span>
                    </button>
                </div>
                <div class="post-action-group">
                    <button class="post-action-btn-social diamond-btn ${diamondedClass}" data-post-id="${post.id}">
                        <i class="fas fa-gem"></i>
                        <span class="count">${post.diamonds}</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Rendu du feed
function renderFeed(postsData) {
    const container = document.getElementById('feedPosts');
    if (!container) return;
    
    if (postsData.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: var(--text-muted);">
                <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 16px; display: block;"></i>
                <p style="font-size: 18px; font-weight: 600; color: var(--text-secondary);">Aucun post à afficher</p>
                <p style="font-size: 14px;">Commencez à suivre des personnes ou créez votre premier post !</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = postsData.map(post => renderPost(post)).join('');
    
    // Attacher les événements
    container.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', handleLike);
    });
    container.querySelectorAll('.diamond-btn').forEach(btn => {
        btn.addEventListener('click', handleDiamond);
    });
}

// Filtrer les posts
function filterPosts(filter) {
    currentFilter = filter;
    let filtered = [...posts];
    
    if (filter === 'following') {
        filtered = filtered.filter(p => p.userId === 'u1' || p.userId === 'u2');
    } else if (filter === 'trending') {
        filtered = filtered.sort((a, b) => b.likes + b.diamonds - (a.likes + a.diamonds));
    } else if (filter === 'nft') {
        filtered = filtered.filter(p => p.isNFT);
    }
    // 'all' : tout afficher
    
    renderFeed(filtered);
}

// Créer un post
async function createPost(content, mediaFiles, privacy) {
    if (!content.trim() && (!mediaFiles || mediaFiles.length === 0)) {
        showToast('Veuillez écrire quelque chose ou ajouter un média', 'error');
        return false;
    }
    
    try {
        showToast('Publication en cours... (transactions sans gaz)', 'info');
        
        // Simuler l'upload IPFS et la transaction Web3
        const result = await window.web3.sendGaslessTransaction({
            action: 'createPost',
            content: content,
            media: mediaFiles ? mediaFiles.length : 0,
            privacy: privacy
        });
        
        if (result.success) {
            const newPost = {
                id: 'p' + (++postCounter),
                userId: 'u1', // Utilisateur connecté
                content: content.trim(),
                media: mediaFiles && mediaFiles.length > 0 ? URL.createObjectURL(mediaFiles[0]) : null,
                isNFT: Math.random() > 0.7,
                timestamp: new Date(),
                likes: 0,
                comments: 0,
                shares: 0,
                diamonds: 0,
                liked: false,
                diamonded: false,
            };
            
            posts = [newPost, ...posts];
            filterPosts(currentFilter);
            showToast('Post publié avec succès ! 🎉', 'success');
            return true;
        }
    } catch (error) {
        showToast(error.message || 'Erreur lors de la publication', 'error');
        return false;
    }
}

// Gérer les likes
async function handleLike(e) {
    const btn = e.currentTarget;
    const postId = btn.dataset.postId;
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    const isLiked = post.liked;
    
    try {
        await window.web3.sendGaslessTransaction({
            action: isLiked ? 'unlike' : 'like',
            postId: postId
        });
        
        post.liked = !isLiked;
        post.likes += isLiked ? -1 : 1;
        filterPosts(currentFilter);
        
        showToast(isLiked ? 'Like retiré' : 'Post liké ! ❤️', 'success');
    } catch (error) {
        showToast('Erreur lors du like', 'error');
    }
}

// Gérer les diamants
async function handleDiamond(e) {
    const btn = e.currentTarget;
    const postId = btn.dataset.postId;
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    if (post.diamonded) {
        showToast('Vous avez déjà envoyé un diamant sur ce post', 'info');
        return;
    }
    
    try {
        await window.web3.sendGaslessTransaction({
            action: 'diamond',
            postId: postId
        });
        
        post.diamonded = true;
        post.diamonds += 1;
        filterPosts(currentFilter);
        
        showToast('💎 Diamant envoyé avec succès !', 'success');
    } catch (error) {
        showToast('Erreur lors de l\'envoi du diamant', 'error');
    }
}

// Charger plus de posts (simulation)
function loadMorePosts() {
    const btn = document.getElementById('loadMoreBtn');
    const icon = btn.querySelector('i');
    icon.style.display = 'inline-block';
    btn.disabled = true;
    
    setTimeout(() => {
        // Ajouter des posts mockés supplémentaires
        const newPosts = [
            {
                id: 'p' + (++postCounter),
                userId: ['u2', 'u3', 'u4', 'u5'][Math.floor(Math.random() * 4)],
                content: '🔥 Nouveau post de la communauté ! ' + Math.random().toString(36).slice(2, 20),
                media: null,
                isNFT: Math.random() > 0.8,
                timestamp: new Date(Date.now() - 1000 * 60 * Math.floor(Math.random() * 30)),
                likes: Math.floor(Math.random() * 50),
                comments: Math.floor(Math.random() * 15),
                shares: Math.floor(Math.random() * 10),
                diamonds: Math.floor(Math.random() * 20),
                liked: false,
                diamonded: false,
            }
        ];
        
        posts = [...posts, ...newPosts];
        filterPosts(currentFilter);
        
        icon.style.display = 'none';
        btn.disabled = false;
        showToast('Nouveaux posts chargés !', 'info');
    }, 1500);
}

// Exporter
window.postsAPI = {
    renderFeed,
    filterPosts,
    createPost,
    loadMorePosts,
    getPosts: () => posts,
};