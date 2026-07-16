// js/web3.js
// ===== SIMULATION WEB3 POUR OPENSPHERE =====

// État de la connexion Web3
const web3State = {
    connected: false,
    address: '',
    chain: 'Polygon',
    balance: '0',
    networkId: 137,
};

// ===== FONCTIONS PRINCIPALES =====

/**
 * Connecter un portefeuille (simulé)
 * @returns {Promise<Object>} État de la connexion
 */
function connectWallet() {
    return new Promise(function(resolve) {
        showToast('🔗 Connexion du portefeuille en cours...', 'info');
        
        setTimeout(function() {
            // Générer une adresse aléatoire
            const address = '0x' + Array.from({length: 40}, function() {
                return Math.floor(Math.random() * 16).toString(16);
            }).join('');
            
            web3State.connected = true;
            web3State.address = address;
            web3State.balance = (Math.random() * 10).toFixed(4);
            
            // Mettre à jour l'utilisateur dans localStorage
            var user = DataAPI.getUser();
            if (user) {
                user.wallet = address;
                user.sphereBalance = web3State.balance;
                localStorage.setItem('user', JSON.stringify(user));
            }
            
            showToast('✅ Portefeuille connecté avec succès !', 'success');
            resolve({
                success: true,
                address: address,
                balance: web3State.balance,
                chain: web3State.chain
            });
        }, 1500);
    });
}

/**
 * Déconnecter le portefeuille
 */
function disconnectWallet() {
    web3State.connected = false;
    web3State.address = '';
    web3State.balance = '0';
    showToast('🔒 Portefeuille déconnecté', 'info');
}

/**
 * Envoyer une transaction sans gaz (via Relayer)
 * @param {Object} txData - Données de la transaction
 * @param {string} txData.type - Type de transaction (like, diamond, post, etc.)
 * @param {string} txData.target - Adresse du contrat cible
 * @param {string} txData.data - Données encodées de la transaction
 * @param {number} txData.amount - Montant en $SPHERE (optionnel)
 * @param {string} txData.postId - ID du post (optionnel)
 * @returns {Promise<Object>} Résultat de la transaction
 */
function sendGaslessTransaction(txData) {
    return new Promise(function(resolve, reject) {
        // Vérifier que le portefeuille est connecté
        if (!web3State.connected) {
            reject(new Error('Portefeuille non connecté'));
            return;
        }
        
        // Calculer les frais en fonction du type
        var baseFees = {
            'like': 0.001,
            'diamond': 0.01,
            'post': 0.005,
            'follow': 0.001,
            'vote': 0.002,
            'claim': 0.005,
            'stake': 0.01,
            'unstake': 0.01,
            'comment': 0.002,
            'share': 0.001
        };
        
        var fee = baseFees[txData.type] || 0.001;
        
        // Ajuster en fonction du montant
        if (txData.amount) {
            fee = txData.amount * 0.01; // 1% de frais
        }
        
        // Vérifier le solde de l'utilisateur
        var user = DataAPI.getUser();
        if (user) {
            var balance = parseFloat(user.sphereBalance || 0);
            if (balance < fee) {
                reject(new Error('Solde insuffisant pour payer les frais (' + fee + ' $SPHERE)'));
                return;
            }
        }
        
        showToast('⏳ Transaction en cours... (sans gaz)', 'info');
        
        // Simuler l'envoi de la transaction
        setTimeout(function() {
            var success = Math.random() > 0.05; // 95% de réussite
            
            if (success) {
                var txHash = '0x' + Array.from({length: 64}, function() {
                    return Math.floor(Math.random() * 16).toString(16);
                }).join('');
                
                // Déduire les frais du solde de l'utilisateur
                if (user) {
                    user.sphereBalance = (parseFloat(user.sphereBalance) - fee).toFixed(4);
                    localStorage.setItem('user', JSON.stringify(user));
                    
                    // Mettre à jour l'affichage du solde
                    var balanceEl = document.getElementById('sphereBalance');
                    if (balanceEl) {
                        balanceEl.textContent = user.sphereBalance;
                    }
                }
                
                // Enregistrer la transaction dans localStorage (pour l'historique)
                var transactions = JSON.parse(localStorage.getItem('opensphere_transactions') || '[]');
                transactions.push({
                    id: 'tx_' + Date.now(),
                    type: txData.type,
                    hash: txHash,
                    fee: fee,
                    timestamp: Date.now(),
                    status: 'confirmed',
                    data: txData
                });
                localStorage.setItem('opensphere_transactions', JSON.stringify(transactions));
                
                showToast('✅ Transaction confirmée ! Frais: ' + fee.toFixed(4) + ' $SPHERE', 'success');
                
                resolve({
                    success: true,
                    txHash: txHash,
                    fee: fee,
                    blockNumber: Math.floor(Math.random() * 10000000) + 40000000,
                    message: 'Transaction exécutée avec succès (frais: ' + fee.toFixed(4) + ' $SPHERE)'
                });
            } else {
                showToast('❌ Erreur de transaction, veuillez réessayer', 'error');
                reject(new Error('Erreur de transaction, veuillez réessayer'));
            }
        }, 1200 + Math.random() * 800);
    });
}

/**
 * Obtenir le solde en $SPHERE de l'utilisateur connecté
 * @returns {string} Solde en $SPHERE
 */
function getBalance() {
    var user = DataAPI.getUser();
    if (user) {
        web3State.balance = user.sphereBalance || '0';
        return web3State.balance;
    }
    return '0';
}

/**
 * Staker des tokens $SPHERE
 * @param {number} amount - Montant à staker
 * @returns {Promise<boolean>} Succès ou échec
 */
function stakeTokens(amount) {
    return new Promise(function(resolve) {
        var user = DataAPI.getUser();
        if (!user) {
            showToast('Connectez-vous pour staker', 'error');
            resolve(false);
            return;
        }
        
        var balance = parseFloat(user.sphereBalance || 0);
        if (amount > balance) {
            showToast('Solde insuffisant (solde: ' + balance + ' $SPHERE)', 'error');
            resolve(false);
            return;
        }
        
        if (amount <= 0) {
            showToast('Le montant doit être supérieur à 0', 'error');
            resolve(false);
            return;
        }
        
        showToast('⏳ Staking de ' + amount + ' $SPHERE en cours...', 'info');
        
        // Simuler le staking
        setTimeout(function() {
            var staked = parseFloat(user.stakedAmount || 0) + amount;
            user.sphereBalance = (balance - amount).toFixed(4);
            user.stakedAmount = staked.toFixed(4);
            user.governancePower = Math.floor(staked);
            
            localStorage.setItem('user', JSON.stringify(user));
            
            // Mettre à jour l'affichage
            var balanceEl = document.getElementById('sphereBalance');
            if (balanceEl) {
                balanceEl.textContent = user.sphereBalance;
            }
            
            showToast('✅ ' + amount + ' $SPHERE stakés avec succès !', 'success');
            resolve(true);
        }, 1500);
    });
}

/**
 * Retirer des tokens stakés
 * @param {number} amount - Montant à retirer
 * @returns {Promise<boolean>} Succès ou échec
 */
function unstakeTokens(amount) {
    return new Promise(function(resolve) {
        var user = DataAPI.getUser();
        if (!user) {
            showToast('Connectez-vous pour retirer', 'error');
            resolve(false);
            return;
        }
        
        var staked = parseFloat(user.stakedAmount || 0);
        if (amount > staked) {
            showToast('Montant staké insuffisant (staké: ' + staked + ' $SPHERE)', 'error');
            resolve(false);
            return;
        }
        
        if (amount <= 0) {
            showToast('Le montant doit être supérieur à 0', 'error');
            resolve(false);
            return;
        }
        
        showToast('⏳ Retrait du staking de ' + amount + ' $SPHERE en cours...', 'info');
        
        setTimeout(function() {
            user.stakedAmount = (staked - amount).toFixed(4);
            user.sphereBalance = (parseFloat(user.sphereBalance || 0) + amount).toFixed(4);
            user.governancePower = Math.floor(parseFloat(user.stakedAmount));
            
            localStorage.setItem('user', JSON.stringify(user));
            
            var balanceEl = document.getElementById('sphereBalance');
            if (balanceEl) {
                balanceEl.textContent = user.sphereBalance;
            }
            
            showToast('✅ ' + amount + ' $SPHERE retirés du staking !', 'success');
            resolve(true);
        }, 1500);
    });
}

/**
 * Réclamer les récompenses de gouvernance
 * @returns {Promise<Object>} Résultat de la réclamation
 */
function claimGovernanceRewards() {
    return new Promise(function(resolve) {
        var user = DataAPI.getUser();
        if (!user) {
            showToast('Connectez-vous pour réclamer', 'error');
            resolve({ success: false });
            return;
        }
        
        // Vérifier les récompenses disponibles
        var rewards = JSON.parse(localStorage.getItem('opensphere_rewards') || '{}');
        var amount = rewards[user.id] || 0;
        
        if (amount === 0) {
            showToast('Aucune récompense à réclamer', 'info');
            resolve({ success: false, amount: 0 });
            return;
        }
        
        showToast('⏳ Réclamation des récompenses en cours...', 'info');
        
        setTimeout(function() {
            // Ajouter les récompenses au solde
            user.sphereBalance = (parseFloat(user.sphereBalance || 0) + amount).toFixed(4);
            user.diamondsReceived = (user.diamondsReceived || 0) + Math.floor(amount * 10);
            
            // Supprimer les récompenses réclamées
            delete rewards[user.id];
            localStorage.setItem('opensphere_rewards', JSON.stringify(rewards));
            localStorage.setItem('user', JSON.stringify(user));
            
            var balanceEl = document.getElementById('sphereBalance');
            if (balanceEl) {
                balanceEl.textContent = user.sphereBalance;
            }
            
            showToast('🎁 ' + amount.toFixed(4) + ' $SPHERE réclamés !', 'success');
            resolve({ success: true, amount: amount });
        }, 1500);
    });
}

/**
 * Obtenir l'adresse du portefeuille connecté
 * @returns {string} Adresse du portefeuille
 */
function getWalletAddress() {
    return web3State.address;
}

/**
 * Vérifier si le portefeuille est connecté
 * @returns {boolean} État de la connexion
 */
function isWalletConnected() {
    return web3State.connected;
}

/**
 * Obtenir les informations de la blockchain
 * @returns {Object} Informations sur le réseau
 */
function getNetworkInfo() {
    return {
        chain: web3State.chain,
        networkId: web3State.networkId,
        connected: web3State.connected,
        address: web3State.address
    };
}

/**
 * Simuler un événement de changement de réseau
 * @param {string} chain - Nouvelle chaîne
 */
function switchNetwork(chain) {
    var chains = {
        'polygon': { chain: 'Polygon', id: 137 },
        'ethereum': { chain: 'Ethereum', id: 1 },
        'arbitrum': { chain: 'Arbitrum', id: 42161 },
        'optimism': { chain: 'Optimism', id: 10 },
        'base': { chain: 'Base', id: 8453 }
    };
    
    if (chains[chain]) {
        web3State.chain = chains[chain].chain;
        web3State.networkId = chains[chain].id;
        showToast('🔀 Changé vers ' + chains[chain].chain, 'info');
        return true;
    }
    return false;
}

// ===== EXPORT DES FONCTIONS =====
window.Web3API = {
    connectWallet: connectWallet,
    disconnectWallet: disconnectWallet,
    sendGaslessTransaction: sendGaslessTransaction,
    getBalance: getBalance,
    stakeTokens: stakeTokens,
    unstakeTokens: unstakeTokens,
    claimGovernanceRewards: claimGovernanceRewards,
    getWalletAddress: getWalletAddress,
    isWalletConnected: isWalletConnected,
    getNetworkInfo: getNetworkInfo,
    switchNetwork: switchNetwork,
    state: web3State
};

// ===== INITIALISATION =====
// Vérifier si un utilisateur est déjà connecté
(function initWeb3() {
    var user = DataAPI.getUser();
    if (user && user.wallet) {
        web3State.connected = true;
        web3State.address = user.wallet;
        web3State.balance = user.sphereBalance || '0';
        console.log('🔗 Web3: Utilisateur connecté avec ' + user.wallet);
    } else {
        console.log('🔗 Web3: Aucun utilisateur connecté');
    }
    
    // Charger l'historique des transactions depuis localStorage
    var transactions = JSON.parse(localStorage.getItem('opensphere_transactions') || '[]');
    console.log('📜 ' + transactions.length + ' transactions enregistrées');
})();

// ===== GESTION DES ÉVÉNEMENTS GLOBAUX =====

// Écouter les changements de réseau (simulé)
document.addEventListener('visibilitychange', function() {
    if (!document.hidden && web3State.connected) {
        // Simuler une vérification de connexion
        console.log('🔄 Vérification de la connexion Web3...');
    }
});

// ===== FONCTIONS UTILITAIRES SUPPLÉMENTAIRES =====

/**
 * Signer un message avec le portefeuille (simulé)
 * @param {string} message - Message à signer
 * @returns {Promise<Object>} Signature
 */
function signMessage(message) {
    return new Promise(function(resolve) {
        if (!web3State.connected) {
            reject(new Error('Portefeuille non connecté'));
            return;
        }
        
        setTimeout(function() {
            var signature = '0x' + Array.from({length: 130}, function() {
                return Math.floor(Math.random() * 16).toString(16);
            }).join('');
            
            resolve({
                success: true,
                signature: signature,
                message: message,
                address: web3State.address
            });
        }, 500);
    });
}

// Ajouter la fonction signMessage à l'API
window.Web3API.signMessage = signMessage;

console.log('🌐 Web3 API initialisée');
console.log('📊 ' + (web3State.connected ? '✅ Connecté' : '❌ Déconnecté'));
console.log('🔗 Adresse: ' + (web3State.address || 'Non définie'));