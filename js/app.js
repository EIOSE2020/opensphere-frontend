// js/app.js
// ===== APPLICATION PRINCIPALE =====

document.addEventListener('DOMContentLoaded', () => {
    // Initialiser le profil
    if (window.profileAPI) {
        window.profileAPI.initProfile();
    }
    
    // Initialiser le feed
    if (window.postsAPI) {
        window.postsAPI.filterPosts('all');
    }
    
    // ===== ÉVÉNEMENTS =====
    
    // Filtres du feed
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const filter = this.dataset.filter;
            if (window.postsAPI) {
                window.postsAPI.filterPosts(filter);
            }
        });
    });
    
    // Ouvrir le modal de création de post
    const openModalBtns = document.querySelectorAll('#openPostModal, #createPostBox .post-input');
    const modal = document.getElementById('postModal');
    const closeModal = document.getElementById('closeModal');
    const cancelModal = document.getElementById('cancelModal');
    const postInput = document.getElementById('postInput');
    const modalPostText = document.getElementById('modalPostText');
    
    function openModal() {
        modal.classList.add('active');
        modalPostText.focus();
    }
    
    function closeModalFn() {
        modal.classList.remove('active');
        modalPostText.value = '';
        document.getElementById('modalMediaPreview').innerHTML = '';
    }
    
    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Copier le texte du post rapide dans le modal
            if (postInput.value.trim()) {
                modalPostText.value = postInput.value;
            }
            openModal();
        });
    });
    
    if (closeModal) closeModal.addEventListener('click', closeModalFn);
    if (cancelModal) cancelModal.addEventListener('click', closeModalFn);
    
    // Fermer le modal au clic sur l'overlay
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModalFn();
    });
    
    // Fermer au bouton Echap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModalFn();
        }
    });
    
    // ===== PUBLIER UN POST =====
    const publishBtn = document.getElementById('publishPost');
    const submitPostBtn = document.getElementById('submitPost');
    
    async function handlePublish() {
        const content = modalPostText.value || postInput.value;
        const privacy = document.getElementById('modalPrivacy')?.value || 'public';
        
        // Récupérer les fichiers du modal
        const fileInput = document.getElementById('modalFileInput');
        const files = fileInput?.files || [];
        
        const success = await window.postsAPI.createPost(content, files, privacy);
        
        if (success) {
            postInput.value = '';
            modalPostText.value = '';
            document.getElementById('modalMediaPreview').innerHTML = '';
            if (fileInput) fileInput.value = '';
            closeModalFn();
        }
    }
    
    if (publishBtn) publishBtn.addEventListener('click', handlePublish);
    if (submitPostBtn) {
        submitPostBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Ouvrir le modal avec le texte du post rapide
            openModal();
        });
    }
    
    // Envoyer avec Ctrl+Enter dans le modal
    if (modalPostText) {
        modalPostText.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handlePublish();
            }
        });
    }
    
    // ===== MÉDIAS DU MODAL =====
    const modalMediaBtn = document.getElementById('modalMediaBtn');
    const modalVideoBtn = document.getElementById('modalVideoBtn');
    const modalFileInput = document.getElementById('modalFileInput');
    const modalMediaPreview = document.getElementById('modalMediaPreview');
    
    if (modalMediaBtn) {
        modalMediaBtn.addEventListener('click', () => {
            modalFileInput.accept = 'image/*';
            modalFileInput.click();
        });
    }
    
    if (modalVideoBtn) {
        modalVideoBtn.addEventListener('click', () => {
            modalFileInput.accept = 'video/*';
            modalFileInput.click();
        });
    }
    
    if (modalFileInput) {
        modalFileInput.addEventListener('change', function() {
            modalMediaPreview.innerHTML = '';
            const files = Array.from(this.files);
            files.forEach(file => {
                const url = URL.createObjectURL(file);
                const el = file.type.startsWith('image/') ? 
                    `<img src="${url}" alt="Media" />` : 
                    `<video src="${url}"></video>`;
                modalMediaPreview.innerHTML += el;
            });
        });
    }
    
    // ===== PRIVACY SELECTORS =====
    document.querySelectorAll('.privacy-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.privacy-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // ===== LOAD MORE =====
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            if (window.postsAPI) {
                window.postsAPI.loadMorePosts();
            }
        });
    }
    
    // ===== RECHERCHE =====
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        const debouncedSearch = debounce((query) => {
            if (query.length >= 2) {
                showToast(`Recherche de "${query}"...`, 'info');
            }
        }, 500);
        
        searchInput.addEventListener('input', (e) => {
            debouncedSearch(e.target.value.trim());
        });
    }
    
    // ===== DÉCONNEXION =====
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (window.web3) {
                window.web3.disconnectWallet();
            }
            showToast('Déconnexion réussie', 'info');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 500);
        });
    }
    
    // ===== NAVIGATION ACTIVE =====
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // ===== WALLET ACTIONS =====
    document.querySelectorAll('.wallet-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.textContent.trim();
            showToast(`Fonctionnalité "${action}" disponible bientôt`, 'info');
        });
    });
    
    // ===== VOTE =====
    const voteBtn = document.querySelector('.btn-vote');
    if (voteBtn) {
        voteBtn.addEventListener('click', () => {
            showToast('Vote enregistré avec succès ! 🗳️', 'success');
        });
    }
    
    // ===== CLAIM REWARDS =====
    const claimBtn = document.querySelector('.btn-claim');
    if (claimBtn) {
        claimBtn.addEventListener('click', async () => {
            try {
                await window.web3.sendGaslessTransaction({ action: 'claimRewards' });
                showToast('Récompenses réclamées avec succès ! 🎁', 'success');
            } catch {
                showToast('Erreur lors de la réclamation', 'error');
            }
        });
    }
    
    // ===== TOAST DE BIENVENUE =====
    setTimeout(() => {
        showToast('Bienvenue sur OpenSphere ! 🚀 Le réseau social souverain', 'info');
    }, 500);
    
    console.log('🌐 OpenSphere - Frontend Web3 Social Network');
    console.log('⚡ Transactions sans gaz activées');
    console.log('💎 $SPHERE Token intégré');
});