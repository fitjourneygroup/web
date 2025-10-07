// ============================
// Cookies Banner – plně legální
// ============================

if (!localStorage.getItem('cookiesAccepted') && !localStorage.getItem('cookiesDeclined')) {
    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.innerHTML = `
        <p>
            Na našem webu používáme cookies pro analýzu návštěvnosti a zobrazování reklam. 
            <a href="/privacy-policy.html" target="_blank" style="color:#4CAF50; text-decoration: underline;">Zásady cookies</a>.
            <button id="accept-cookies">Rozumím</button>
            <button id="decline-cookies">Odmítnout</button>
        </p>
    `;
    document.body.appendChild(banner);

    // Funkce pro načtení sledovacích skriptů až po souhlasu
    function loadTrackingScripts() {
        // Příklad: Google Analytics
        const gaScript = document.createElement('script');
        gaScript.src = "https://www.googletagmanager.com/gtag/js?id=UA-XXXXXXX-X";
        gaScript.async = true;
        document.head.appendChild(gaScript);

        gaScript.onload = function() {
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'UA-XXXXXXX-X');
        };

        // místo pro přidání dalších sledovacích skriptů dynamicky
    }

    // Přijetí cookies
    document.getElementById('accept-cookies').addEventListener('click', function() {
        banner.style.display = 'none';
        localStorage.setItem('cookiesAccepted', 'true');
        loadTrackingScripts();
    });

    // Odmítnutí cookies
    document.getElementById('decline-cookies').addEventListener('click', function() {
        banner.style.display = 'none';
        localStorage.setItem('cookiesDeclined', 'true');
        // Žádné sledovací skripty se nenačítají
    });
}