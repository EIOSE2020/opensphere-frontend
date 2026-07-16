// js/app.js
// ===== APPLICATION PRINCIPALE =====

document.addEventListener('DOMContentLoaded', function() {
    // 1. Mettre à jour l'UI d'authentification
    updateAuthUI();

    // 2. Charger le feed
    loadFeed();

    // 3. Initialiser le profil
    if (window.ProfileAPI) {
        window.ProfileAPI.initProfile();
    }

    // ===== ÉVÉNEMENTS =====

    // Filtres du feed
    document.querySelectorAll('.filter-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
            this.classList.add('active');
            loadFeed();
        });
    });

    // Ouvrir le modal de création de post
    var openModalBtns = document.querySelectorAll('#openPostModal, #createPostBox .post-input');
    var modal = document.getElementById('postModal');
    var closeModal = document.getElementById('closeModal');
    var cancelModal = document.getElementById('cancelModal');
    var postInput = document.getElementById('postInput');
    var modalPostText = document.getElementById('modalPostText');

    function openModalFn() { modal.classList.add('active'); modalPostText.focus(); }
    function closeModalFn() {
        modal.classList.remove('active');
        modalPostText.value = '';
        document.getElementById('modalMediaPreview').innerHTML = '';
        document.getElementById('modalFileInput').value = '';
    }

    openModalBtns.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (postInput.value.trim()) { modalPostText.value = postInput.value; }
            openModalFn();
        });
    });

    if (closeModal) closeModal.addEventListener('click', closeModalFn);
    if (cancelModal) cancelModal.addEventListener('click', closeModalFn);
    modal.addEventListener('click', function(e) { if (e.target === modal) closeModalFn(); });
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape' && modal.classList.contains('active')) closeModalFn(); });

    var publishBtn = document.getElementById('publishPost');
    var submitPostBtn = document.getElementById('submitPost');

    async function handlePublish() {
        var content = modalPostText.value || postInput.value;
        var privacy = document.getElementById('modalPrivacy')?.value || 'public';
        var fileInput = document.getElementById('modalFileInput');
        var files = fileInput?.files || [];
        var mediaUrls = [];

        // Simuler l'upload des fichiers (à remplacer par IPFS plus tard)
        for (var i = 0; i < files.length; i++) {
            mediaUrls.push(URL.createObjectURL(files[i]));
        }

        try {
            var post = await window.DataAPI.createPost(content, mediaUrls, privacy);
            showToast('Post publié avec succès ! 🎉', 'success');
            postInput.value = '';
            modalPostText.value = '';
            document.getElementById('modalMediaPreview').innerHTML = '';
            if (fileInput) fileInput.value = '';
            closeModalFn();
            loadFeed();
        } catch (error) {
            showToast('Erreur : ' + error.message, 'error');
        }
    }

    if (publishBtn) publishBtn.addEventListener('click', handlePublish);
    if (submitPostBtn) {
        submitPostBtn.addEventListener('click', function(e) { e.preventDefault(); openModalFn(); });
    }

    // ... (le reste du code, notamment les événements pour les likes, diamants, etc.)
});

// ===== CHARGER LE FEED =====
async function loadFeed() {
    var container = document.getElementById('feedPosts');
    if (!container) return;

    try {
        var posts = await window.DataAPI.getPosts();
        if (posts.length === 0) {
            container.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-muted);"><i class="fas fa-inbox" style="font-size: 48px; display: block; margin-bottom: 16px;"></i><p>Aucun post à afficher</p></div>';
            return;
        }
        renderPosts(posts);
    } catch (error) {
        container.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--red-danger);">Erreur chargement : ' + error.message + '</div>';
    }
}

function renderPosts(posts) {
    var container = document.getElementById('feedPosts');
    if (!container) return;

    container.innerHTML = posts.map(function(post) {
        return renderPost(post);
    }).join('');

    // Attacher les événements
    container.querySelectorAll('.like-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            handleLike(this.dataset.postId);
        });
    });
    container.querySelectorAll('.diamond-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            handleDiamond(this.dataset.postId);
        });
    });
}

function renderPost(post) {
    var user = post.authorId || {};
    var timeAgo = formatTimeAgo(new Date(post.createdAt));
    var mediaHTML = post.media && post.media.length > 0 ?
        '<div class="post-media"><img src="' + post.media[0] + '" alt="Post media" loading="lazy" /></div>' : '';
    var nftBadge = post.isNFT ? '<div class="post-nft-badge"><i class="fas fa-crown"></i> NFT Collection</div>' : '';

    return `
        <div class="post-card" data-post-id="${post.id}">
            <div class="post-header">
                <img src="${user.avatar || 'https://i.pravatar.cc/40'}" alt="${user.displayName || 'User'}" class="post-avatar" />
                <div class="post-user-info">
                    <div class="post-user-name">
                        ${user.displayName || 'Utilisateur'}
                        ${user.verified ? '<i class="fas fa-check-circle verified"></i>' : ''}
                        <span class="post-username">@${user.username || 'user'}</span>
                        <span class="post-time">· ${timeAgo}</span>
                    </div>
                </div>
            </div>
            <div class="post-content">${escapeHtml(post.content)}</div>
            ${mediaHTML}
            ${nftBadge}
            <div class="post-actions-bar">
                <div class="post-action-group">
                    <button class="post-action-btn-social like-btn" data-post-id="${post.id}">
                        <i class="fas fa-heart"></i>
                        <span class="count">${post.likes || 0}</span>
                    </button>
                    <button class="post-action-btn-social">
                        <i class="fas fa-comment"></i>
                        <span class="count">${post.comments || 0}</span>
                    </button>
                    <button class="post-action-btn-social">
                        <i class="fas fa-retweet"></i>
                        <span class="count">${post.shares || 0}</span>
                    </button>
                </div>
                <div class="post-action-group">
                    <button class="post-action-btn-social diamond-btn" data-post-id="${post.id}">
                        <i class="fas fa-gem"></i>
                        <span class="count">${post.diamonds || 0}</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ===== LIKES & DIAMONDS =====
async function handleLike(postId) {
    try {
        var result = await window.DataAPI.likePost(postId);
        // Mettre à jour l'affichage du post
        showToast('Like mis à jour ! ❤️', 'success');
        loadFeed();
    } catch (error) {
        showToast('Erreur like : ' + error.message, 'error');
    }
}

async function handleDiamond(postId) {
    try {
        var result = await window.DataAPI.diamondPost(postId);
        showToast('💎 Diamant envoyé !', 'success');
        loadFeed();
    } catch (error) {
        showToast('Erreur diamond : ' + error.message, 'error');
    }
}

// ===== AUTHENTIFICATION =====
function updateAuthUI() {
    var user = window.DataAPI.getUser();
    var loginBtn = document.getElementById('loginBtn');
    var userMenu = document.getElementById('userMenu');
    var authButtons = document.getElementById('authButtons');

    if (user) {
        if (authButtons) authButtons.style.display = 'none';
        if (userMenu) {
            userMenu.style.display = 'flex';
            userMenu.style.alignItems = 'center';
            userMenu.style.gap = '8px';
        }
    } else {
        if (authButtons) authButtons.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';
    }

    // Gestion du bouton de déconnexion
    var logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        var newLogoutBtn = logoutBtn.cloneNode(true);
        logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);
        newLogoutBtn.addEventListener('click', function() {
            window.DataAPI.logout();
        });
    }
}

console.log('🌐 OpenSphere - Frontend Web3 Social Network');
console.log('⚡ Transactions sans gaz activées');
console.log('💎 $SPHERE Token intégré');