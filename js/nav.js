document.addEventListener('DOMContentLoaded', function() {
    // Cargar el navbar
    fetch('./components/navbar.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('afterbegin', data);
            initializeNavbar();
            initializeMobileMenu();
            initializeSearchModal();
            addDynamicStyles();
        })
        .catch(error => console.error('Error loading navbar:', error));
});

function initializeNavbar() {
    // Menú hamburguesa (versión simplificada que será reemplazada por initializeMobileMenu)
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    if (mobileMenuButton) {
        const icon = mobileMenuButton.querySelector('i');
        mobileMenuButton.addEventListener('click', function() {
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }
}

function initializeMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const closeMenuButton = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuOverlay = document.getElementById('menu-overlay');

    if (!mobileMenuButton || !mobileMenu) return;

    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.remove('-translate-x-full');
        mobileMenu.classList.remove('hidden');
        if (menuOverlay) menuOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Cambiar ícono
        const icon = mobileMenuButton.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }
    });

    if (closeMenuButton) {
        closeMenuButton.addEventListener('click', closeMobileMenu);
    }

    if (menuOverlay) {
        menuOverlay.addEventListener('click', closeMobileMenu);
    }

    function closeMobileMenu() {
        mobileMenu.classList.add('-translate-x-full');
        if (menuOverlay) menuOverlay.classList.add('hidden');
        document.body.style.overflow = '';
        
        // Cambiar ícono
        const icon = mobileMenuButton.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
}

function initializeSearchModal() {
    const searchModal = document.getElementById('search-modal');
    const searchButton = document.getElementById('search-button');               // desktop
    const mobileSearchButton = document.getElementById('mobile-search-button'); // mobile
    const closeSearch = document.getElementById('close-search');
    const searchInput = searchModal ? searchModal.querySelector('input[name="q"]') : null;

    function openSearchModal() {
        if (!searchModal) return;
        // Quita hidden y usa flex para centrar el contenido (Tailwind)
        searchModal.classList.remove('hidden');
        searchModal.classList.add('open', 'flex');
        document.body.classList.add('search-open');

        if (searchInput) {
            setTimeout(() => searchInput.focus(), 100);
        }
    }

    function closeSearchModal() {
        if (!searchModal) return;
        searchModal.classList.add('hidden');
        searchModal.classList.remove('open', 'flex');
        document.body.classList.remove('search-open');
    }

    if (searchButton) searchButton.addEventListener('click', (e) => {
        e.preventDefault();
        openSearchModal();
    });

    if (mobileSearchButton) mobileSearchButton.addEventListener('click', (e) => {
        e.preventDefault();
        openSearchModal();
    });

    if (closeSearch) {
        closeSearch.addEventListener('click', (e) => {
            e.preventDefault();
            closeSearchModal();
        });
    }

    if (searchModal) {
        // Cerrar haciendo clic en el fondo oscuro
        searchModal.addEventListener('click', function(e) {
            if (e.target === searchModal) {
                closeSearchModal();
            }
        });
    }

    // Cerrar con la tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchModal && searchModal.classList.contains('open')) {
            closeSearchModal();
        }
    });
}

function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
        
        /* Animación suave de aparición (puedes usarla si quieres en el modal añadiendo la clase anim) */
        .anim {
            animation: fadeIn 0.3s ease-in-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        /* Para compatibilidad con otros usos, pero ya no se usa para el modal nuevo */
        .none {
            display: none;
        }
        
        /* Estilos para el menú móvil */
        .-translate-x-full {
            transform: translateX(-100%);
        }
        
        #mobile-menu {
            transition: transform 0.3s ease-in-out;
        }
        
        #menu-overlay {
            background-color: rgba(0, 0, 0, 0.5);
        }

        /* Mostrar el modal de búsqueda cuando tenga la clase .open */
        #search-modal.open {
            display: block;
        }

        /* Evitar scroll del body cuando el buscador está abierto */
        body.search-open {
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);
}