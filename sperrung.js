document.addEventListener("DOMContentLoaded", function () {
    const currentPage = window.location.pathname;
    const blockedPages = JSON.parse(localStorage.getItem("blockedPages") || "[]");

    // ✅ Wenn Seite bereits blockiert ist
    if (blockedPages.includes(currentPage)) {
        const infoBox = document.createElement("div");
        infoBox.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 80vw;
                height: 80vh;
                background-color: rgba(0, 0, 0, 0.95);
                background-image: url('achtung.jpg'); /* Hier kannst du das Bild einfügen */
                background-size: cover;
                color: white;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                font-family: sans-serif;
                font-size: 20px;
                z-index: 9999;
                text-align: center;
                padding: 20px;
                border-radius: 10px;">
                
                <div style="font-size: 34px; margin-bottom: 20px;">
                    ⚠️ Patient bereits gescannt ⚠️
                </div>
                
                <div style="flex-grow: 1; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                    <button id="scanAgainBtn" style="
                        font-size: 20px;
                        padding: 25px 25px;
                        background-color: #00aaff;
                        border: none;
                        border-radius: 10px;
                        color: white;
                        cursor: pointer;
                        margin-bottom: 20px;">
                        Neuen Patienten scannen
                    </button>
                    <button id="releaseBtn" style="
                        font-size: 20px;
                        padding: 25px 25px;
                        background-color: #ff5500;
                        border: none;
                        border-radius: 10px;
                        color: white;
                        cursor: pointer;
                        margin-top: auto;">
                        Sperrung aufheben
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(infoBox);

        // ➕ Alle Buttons deaktivieren
        const scenarioButtons = document.querySelectorAll(".btn, .sk-btn");
        scenarioButtons.forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = "0.5";
            btn.style.pointerEvents = "none";
        });

        // 👉 Statt Kamera: einfach Weiterleitung zu status4.html
        const scanBtn = document.getElementById("scanAgainBtn");
        if (scanBtn) {
            scanBtn.addEventListener("click", function () {
                window.location.href = "status4.html";
            });
        }

        // Manuell Sperrung aufheben
        const releaseBtn = document.getElementById("releaseBtn");
        if (releaseBtn) {
            releaseBtn.addEventListener("click", function () {
                // Sperrung aufheben, Seite freigeben
                removeBlock();
                location.reload();
            });
        }

        // Automatische Freigabe nach 30 Sekunden
        setTimeout(function () {
            console.log("30 Sekunden vorbei, Sperrung wird aufgehoben.");
            removeBlock();
            location.reload();
        }, 30000); // 30 Sekunden = 30000 Millisekunden

        return; // Alles andere wird abgebrochen
    }

    // ➕ Wenn noch nicht gesperrt, jetzt blockieren
    blockedPages.push(currentPage);
    localStorage.setItem("blockedPages", JSON.stringify(blockedPages));

    // 🧹 Seitenfreigabe und Weiterleitung
    const clearAndRedirect = (redirectURL) => {
        let updatedBlockedPages = JSON.parse(localStorage.getItem("blockedPages") || "[]");
        updatedBlockedPages = updatedBlockedPages.filter(page => page !== currentPage);
        localStorage.setItem("blockedPages", JSON.stringify(updatedBlockedPages));
        window.location.href = redirectURL;
    };

    const neuerEinsatzBtn = document.getElementById("neuerEinsatzButton");
    const einsatzendeButton = document.getElementById("einsatzendeButton");
    const homeBtn = document.getElementById("startseiteButton");

    if (neuerEinsatzBtn) {
        neuerEinsatzBtn.addEventListener("click", () => clearAndRedirect("startseite.html"));
    }

    if (einsatzendeButton) {
        einsatzendeButton.addEventListener("click", () => clearAndRedirect("Auswertung.html"));
    }

    if (homeBtn) {
        homeBtn.addEventListener("click", () => clearAndRedirect("startseite.html"));
    }

    // **Füge hier die Logik für den Status 4 Button hinzu**
    const cameraButton = document.getElementById("cameraButton");

    if (cameraButton) {
        cameraButton.addEventListener("click", function () {
            console.log("Status 4 Button geklickt, setze Blockierungen zurück.");

            // **Blockierungen für die Seite zurücksetzen**
            removeBlock();

            // Debugging: Zeige an, ob der localStorage wirklich leer ist
            console.log("localStorage nach Zurücksetzen:", localStorage);

            // Seite neu laden
            location.reload();
        });
    }

    // Funktion zum Entfernen der Blockierung
    function removeBlock() {
        let updatedBlockedPages = JSON.parse(localStorage.getItem("blockedPages") || "[]");
        updatedBlockedPages = updatedBlockedPages.filter(page => page !== currentPage);
        localStorage.setItem("blockedPages", JSON.stringify(updatedBlockedPages));
    }
});
