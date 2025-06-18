

let countdownIntervals = {};

function toggleButtons(currentButtonId, nextButtonId) {
    // Alle Buttons ausblenden
    document.querySelectorAll(".btn").forEach(btn => btn.classList.add("hidden"));
    // Nur den nächsten Button anzeigen
    document.getElementById(nextButtonId).classList.remove("hidden");
}

function startCountdown(buttonId, countdownId, nextButtonId, seconds) {
    let countdownElement = document.getElementById(countdownId);
    let timeLeft = seconds;
    countdownElement.style.visibility = "visible";
    countdownElement.innerText = timeLeft;
    document.getElementById(buttonId).disabled = true;

    countdownIntervals[buttonId] = setInterval(() => {
        timeLeft--;
        countdownElement.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(countdownIntervals[buttonId]);
            // Nur den nächsten Button anzeigen
            toggleButtons(buttonId, nextButtonId);
        }
    }, 1000);
}

function redirectToIndex() {
    window.location.href = "/status4.html";
}

document.getElementById("btn1").addEventListener("click", function () {
    toggleButtons("btn1", "btn2");
});

document.getElementById("btn2").addEventListener("click", function () {
    toggleButtons("btn2", "btnCountdown1");
    document.getElementById("btnCountdown2").classList.remove("hidden");
    document.getElementById("btnCountdown3").classList.remove("hidden");
    document.getElementById("modal").style.display = "flex"; // Bild wird angezeigt
});

document.getElementById("btnCountdown1").addEventListener("click", function () {
    startCountdown("btnCountdown1", "countdown1", "btn3", 40);
});

document.getElementById("btnCountdown2").addEventListener("click", function () {
    startCountdown("btnCountdown2", "countdown2", "btn3", 20);
});

document.getElementById("btnCountdown3").addEventListener("click", function () {
    startCountdown("btnCountdown3", "countdown3", "btnCustom", 01);
});

document.getElementById("btn3").addEventListener("click", function () {
    toggleButtons("btn3", "btn4");
});

document.getElementById("btnCustom").addEventListener("click", function () {
    toggleButtons("btnCustom", "btn4");
    document.getElementById("sk-btns").classList.remove("hidden"); // Zeigt sk-btns an
});
document.getElementById("btn3").addEventListener("click", function () {
    toggleButtons("btnCustom", "btn4");
    document.getElementById("sk-btns").classList.remove("hidden"); // Zeigt sk-btns an
});

        fetch("Btninstruktor.html")
            .then(response => response.text())
            .then(html => {
                document.getElementById("button-container").innerHTML = html;
            });
            document.getElementById("btn4").addEventListener("click", async () => {
                try {
                    document.getElementById("btn4").style.display = "none"; // Button wird ausgeblendet
            
                    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                        alert("Die Kamera-API wird von diesem Gerät nicht unterstützt.");
                        return;
                    }
            
                    const stream = await navigator.mediaDevices.getUserMedia({
                        video: { facingMode: "environment" } // Rückkamera bevorzugt
                    });
            
                    const videoElement = document.getElementById("video");
                    videoElement.srcObject = stream;
                    videoElement.style.display = "block"; // Video sichtbar machen
            
                    videoElement.onloadedmetadata = () => {
                        videoElement.play();
                        startQRCodeDetection();  // QR-Code-Erkennung starten
                    };
                } catch (error) {
                    console.error("Kamera-Zugriff fehlgeschlagen:", error);
                    alert("Kamera-Zugriff fehlgeschlagen. Bitte Berechtigungen prüfen.");
                }
            });
            
            // QR-Code-Detection Funktion
            function startQRCodeDetection() {
                const videoElement = document.getElementById("video");
            
                // Setze eine Funktion zum kontinuierlichen Scannen des Video-Streams
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
            
                function scanQRCode() {
                    if (videoElement.paused || videoElement.ended) return;
            
                    canvas.width = videoElement.videoWidth;
                    canvas.height = videoElement.videoHeight;
                    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            
                    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                    const code = jsQR(imageData.data, canvas.width, canvas.height);
            
                    if (code) {
                        console.log("✅ QR-Code erkannt, Weiterleitung zu:", code.data);
                        window.location.href = code.data;
                    }
                    
                    
            
                    requestAnimationFrame(scanQRCode); // Weiter scannen
                }
            
                scanQRCode(); // Starte das Scannen
            }
            


// Schließen des Bildes durch Klick auf den Schließen-Button
document.getElementById("closeModal").addEventListener("click", function () {
    document.getElementById("modal").style.display = "none";
});

// Schließen des Bildes durch Klick auf das Modal
document.getElementById("modal").addEventListener("click", function (e) {
    if (e.target === document.getElementById("modal")) {
        document.getElementById("modal").style.display = "none";
    }
});

// Event-Listener für alle SK-Buttons setzen
document.querySelectorAll('.sk-btn').forEach(button => {
    button.addEventListener('click', function() {
        const sichtung = this.getAttribute('data-sichtung'); // Rot, Gelb, Grün, Schwarz
        const patientId = window.location.pathname.replace(/\D/g, ''); // Patientennummer aus URL extrahieren
        
        if (patientId) {
            localStorage.setItem(`sichtung_${patientId}`, sichtung); // Sichtung speichern
            console.log(`✅ Sichtung für Patient ${patientId} gespeichert: ${sichtung}`);
        } else {
            console.error("❌ Keine Patientennummer gefunden!");
        }
    });
});

const buttons = document.querySelectorAll('.sk-btn');

buttons.forEach(button => {
    button.addEventListener('click', function() {
        // Entferne die Hervorhebung von allen Buttons
        buttons.forEach(btn => btn.classList.remove('selected')); 
        
        // Füge die Hervorhebung nur dem geklickten Button hinzu
        this.classList.add('selected'); 
        
        // Hier kannst du weiterhin deine Datensicherung vornehmen
        const sichtung = this.getAttribute('data-sichtung');
        console.log('Daten gesichert für: ' + sichtung);
        localStorage.setItem('sichtung', sichtung);
    });
});
