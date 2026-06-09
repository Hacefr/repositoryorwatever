// Function to handle game search filtering
function initSearch() {
    const searchBar = document.getElementById('searchBar');
    
    if (!searchBar) return;

    searchBar.addEventListener('keyup', function() {
        const query = searchBar.value.toLowerCase();
        const grid = document.getElementById('gameGrid');
        const cards = grid.getElementsByClassName('card');
        const noResultsMessage = document.getElementById('noResultsMessage');
        
        let visibleCount = 0;

        // Loop through all game cards inside the storefront grid
        for (let i = 0; i < cards.length; i++) {
            const searchTags = cards[i].getAttribute('data-name');
            
            if (searchTags && searchTags.toLowerCase().includes(query)) {
                cards[i].style.display = "";
                visibleCount++;
            } else {
                cards[i].style.display = "none";
            }
        }

        // Handle empty matching data states
        if (visibleCount === 0) {
            noResultsMessage.style.display = "block";
        } else {
            noResultsMessage.style.display = "none";
        }
    });
}

// Service Worker background registration trigger for offline environments
function registerOfflineSystem() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .then(registration => {
                    console.log('Storefront offline capabilities fully armed and active.');
                })
                .catch(error => {
                    console.error('Offline initialization failed: ', error);
                });
        });
    }
}

// Start storefront operations on page initialization
document.addEventListener('DOMContentLoaded', () => {
    initSearch();
    registerOfflineSystem();
});
