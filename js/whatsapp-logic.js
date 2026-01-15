document.addEventListener('DOMContentLoaded', () => {
    // Inicializar Facebook si existe
    if (typeof FB !== 'undefined') {
        FB.XFBML.parse();
    }
});

/* =============================================================
   LÓGICA DE WHATSAPP (SISTEMA DE DELEGACIÓN DE EVENTOS)
   ============================================================= */

// CONFIGURACIÓN
const CONFIG_WA = {
    number: "51937700700", // Tu número (51 + 937700700)
    maxChars: 500
};

// 1. DETECTAR ESCRITURA (INPUT)
document.addEventListener('input', function(e) {
    // Solo actuamos si el evento viene de nuestro textarea
    if (e.target && e.target.id === 'wa-question-input') {
        const textarea = e.target;
        const btnSpecific = document.getElementById('btn-wa-specific');
        const counter = document.getElementById('wa-char-counter');
        const len = textarea.value.length;

        // Actualizar contador
        if (counter) {
            counter.textContent = len + "/" + CONFIG_WA.maxChars;
            counter.className = len > (CONFIG_WA.maxChars - 50) ? "text-red-600 font-bold" : "text-gray-400";
        }

        // Activar/Desactivar botón
        if (btnSpecific) {
            if (len > 0) {
                // Habilitar
                btnSpecific.disabled = false;
                btnSpecific.classList.remove('opacity-50', 'cursor-not-allowed', 'grayscale');
                btnSpecific.classList.add('hover:shadow-lg', 'transform', 'hover:-translate-y-0.5');
            } else {
                // Deshabilitar
                btnSpecific.disabled = true;
                btnSpecific.classList.add('opacity-50', 'cursor-not-allowed', 'grayscale');
                btnSpecific.classList.remove('hover:shadow-lg', 'transform', 'hover:-translate-y-0.5');
            }
        }
    }
});

// 2. DETECTAR CLICS (BOTONES)
document.addEventListener('click', function(e) {
    const btnSpecific = e.target.closest('#btn-wa-specific');
    const btnGeneral = e.target.closest('#btn-wa-general');

    // A) BOTÓN PREGUNTA ESPECÍFICA
    if (btnSpecific && !btnSpecific.disabled) {
        e.preventDefault();
        const textarea = document.getElementById('wa-question-input');
        const text = textarea ? textarea.value.trim() : "";
        
        if (!text) return;

        // Obtener nombre del producto
        const section = document.getElementById('faq-whatsapp-section');
        const productName = section ? (section.getAttribute('data-product') || "Producto Web") : "Producto Web";

        const message = `Hola, estoy viendo el *${productName}* en su web y tengo la siguiente duda:\n\n"${text}"`;
        openWhatsApp(message);

        // Feedback visual (limpiar)
        if(textarea) textarea.value = '';
        btnSpecific.disabled = true;
        btnSpecific.classList.add('opacity-50', 'cursor-not-allowed', 'grayscale');
        const counter = document.getElementById('wa-char-counter');
        if(counter) counter.textContent = "0/" + CONFIG_WA.maxChars;
    }

    // B) BOTÓN CONSULTA GENERAL
    if (btnGeneral) {
        e.preventDefault();
        
        const section = document.getElementById('faq-whatsapp-section');
        const productName = section ? (section.getAttribute('data-product') || "Producto Web") : "Producto Web";

        const message = `Hola, quisiera cotizar o recibir más información sobre el producto: *${productName}*`;
        openWhatsApp(message);
    }
});

// Función auxiliar
function openWhatsApp(text) {
    const url = `https://wa.me/${CONFIG_WA.number}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}