document.addEventListener('DOMContentLoaded', function() {
    // 1. CARGAR EL COMPONENTE NAVBAR
    fetch('components/navbar.html')
        .then(response => {
            if (!response.ok) throw new Error("No se pudo cargar el navbar");
            return response.text();
        })
        .then(data => {
            // Insertar el HTML al principio del body
            document.body.insertAdjacentHTML('afterbegin', data);
            
            // 2. INICIALIZAR FUNCIONES (Una vez que el HTML existe)
            initMobileMenu();
            initSearchModal();
            setProductBrandLogo(); // <--- IMPORTANTE: Carga el logo de la marca
        })
        .catch(error => console.error('Error loading navbar:', error));
});

/* =========================================
   A. LÓGICA LOGO DINÁMICO DE MARCA
   ========================================= */
function setProductBrandLogo() {
    // 1. Leer los atributos configurados en la etiqueta <body> de tu HTML
    const logoSrc = document.body.getAttribute('data-brand-logo');
    const logoName = document.body.getAttribute('data-brand-name');

    // Si no hay logo definido en el body, no hacemos nada (se queda oculto)
    if (!logoSrc) return;

    // 2. Referencias a las imágenes en el Navbar (PC y Móvil)
    const desktopImg = document.getElementById('product-brand-logo-desktop');
    const mobileImg = document.getElementById('product-brand-logo-mobile');

    // 3. Actualizar Logo PC
    if (desktopImg) {
        desktopImg.src = logoSrc;
        desktopImg.alt = logoName || 'Marca';
        desktopImg.classList.remove('hidden'); // Hace visible la imagen
        // Añadir animación suave si está definida en CSS
        desktopImg.classList.add('brand-fade-in'); 
    }

    // 4. Actualizar Logo Móvil
    if (mobileImg) {
        mobileImg.src = logoSrc;
        mobileImg.alt = logoName || 'Marca';
        mobileImg.classList.remove('hidden'); // Hace visible la imagen
        mobileImg.classList.add('brand-fade-in');
    }
}

/* =========================================
   B. MENÚ MÓVIL (TIPO DRAWER LATERAL)
   ========================================= */
function initMobileMenu() {
    const btnOpen = document.getElementById('mobile-menu-button');
    const btnClose = document.getElementById('close-menu');
    const menu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('menu-overlay');

    // Validación de seguridad por si no encuentra elementos
    if (!btnOpen || !menu || !overlay) return;

    function openMenu() {
        menu.classList.remove('-translate-x-full'); // Entra el menú
        overlay.classList.remove('hidden');         // Muestra fondo oscuro
        document.body.style.overflow = 'hidden';    // Bloquea scroll de la página
    }

    function closeMenu() {
        menu.classList.add('-translate-x-full');    // Sale el menú
        overlay.classList.add('hidden');            // Oculta fondo oscuro
        document.body.style.overflow = '';          // Restaura scroll
    }

    // Eventos
    btnOpen.addEventListener('click', openMenu);
    btnClose.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);
}

/* =========================================
   C. BUSCADOR MÓVIL (TIPO MODAL)
   ========================================= */
function initSearchModal() {
    const btnOpen = document.getElementById('mobile-search-open');
    const btnClose = document.getElementById('close-search');
    const modal = document.getElementById('search-modal');
    const input = modal ? modal.querySelector('input[name="q"]') : null;

    if (!btnOpen || !modal) return;

    function openSearch() {
        modal.classList.remove('hidden');
        // Poner foco en el input con un pequeño retraso para asegurar que es visible
        setTimeout(() => {
            if(input) input.focus();
        }, 100);
        document.body.style.overflow = 'hidden';
    }

    function closeSearch() {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    // Eventos
    btnOpen.addEventListener('click', (e) => {
        e.preventDefault();
        openSearch();
    });

    if (btnClose) {
        btnClose.addEventListener('click', (e) => {
            e.preventDefault();
            closeSearch();
        });
    }

    // Cerrar si se hace click fuera del formulario (en la zona oscura)
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeSearch();
    });

    // Cerrar con la tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeSearch();
        }
    });
}