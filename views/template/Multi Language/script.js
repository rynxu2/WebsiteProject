$(document).ready(function() {
    // Language translations
    const translations = {
        en: {
            welcome: "Welcome to our website!",
            description: "This is a demonstration of a multi-language website using HTML, CSS, JavaScript, Bootstrap, and jQuery.",
            features: "Features",
            feature1: "Easy language switching",
            feature2: "No page reload required",
            feature3: "Responsive design",
            actionButton: "Click me",
            currentLanguage: "English"
        },
        es: {
            welcome: "¡Bienvenido a nuestro sitio web!",
            description: "Esta es una demostración de un sitio web multilingüe que utiliza HTML, CSS, JavaScript, Bootstrap y jQuery.",
            features: "Características",
            feature1: "Cambio de idioma fácil",
            feature2: "No se requiere recargar la página",
            feature3: "Diseño responsivo",
            actionButton: "Haz clic aquí",
            currentLanguage: "Español"
        },
        fr: {
            welcome: "Bienvenue sur notre site web!",
            description: "Ceci est une démonstration d'un site Web multilingue utilisant HTML, CSS, JavaScript, Bootstrap et jQuery.",
            features: "Caractéristiques",
            feature1: "Changement de langue facile",
            feature2: "Pas besoin de recharger la page",
            feature3: "Conception réactive",
            actionButton: "Cliquez ici",
            currentLanguage: "Français"
        }
    };

    // Default language
    let currentLang = 'en';

    // Check for saved language preference
    const savedLang = localStorage.getItem('language');
    if (savedLang && translations[savedLang]) {
        currentLang = savedLang;
    }

    // Apply translations
    function applyTranslations(lang) {
        $('[data-i18n]').each(function() {
            const key = $(this).data('i18n');
            $(this).text(translations[lang][key]);
        });
        $('#currentLanguage').text(translations[lang].currentLanguage);
        
        // Add fade-in effect
        $('body').addClass('fade-in');
        setTimeout(() => $('body').removeClass('fade-in'), 500);
    }

    // Initialize with default language
    applyTranslations(currentLang);

    // Language switcher
    $('.dropdown-item').click(function(e) {
        e.preventDefault();
        const lang = $(this).data('lang');
        if (translations[lang]) {
            currentLang = lang;
            localStorage.setItem('language', lang);
            applyTranslations(lang);
        }
    });

    // Button click event
    $('[data-i18n="actionButton"]').click(function() {
        let message = "";
        switch(currentLang) {
            case 'en':
                message = "Button clicked!";
                break;
            case 'es':
                message = "¡Botón pulsado!";
                break;
            case 'fr':
                message = "Bouton cliqué!";
                break;
        }
        alert(message);
    });
});