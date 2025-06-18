
let countdownIntervals = {};  // Die Intervall-IDs für den Countdown

// Funktion zum Wechseln der sichtbaren Buttons
function toggleButtons(currentButtonId, nextButtonId) {
    document.getElementById(currentButtonId).classList.add("hidden");
    document.getElementById(nextButtonId).classList.remove("hidden");
}

// Funktion zum Starten des Countdowns
function startCountdown(buttonId, countdownId, nextButtonId, otherButtonId, seconds) {
    let countdownElement = document.getElementById(countdownId);
    let timeLeft = seconds;
    countdownElement.style.visibility = "visible";
    countdownElement.innerText = timeLeft;
    document.getElementById(buttonId).disabled = true;
    document.getElementById(otherButtonId).disabled = true;

    countdownIntervals[buttonId] = setInterval(() => {
        timeLeft--;
        countdownElement.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(countdownIntervals[buttonId]);
            document.getElementById(buttonId).classList.add("hidden");
            document.getElementById(otherButtonId).classList.add("hidden");
            document.getElementById(nextButtonId).classList.remove("hidden");

            // Nur wenn btn4 erscheint (z. B. nach btnCountdown2), zeigen wir die SK-Buttons
            if (nextButtonId === "btn4") {
                document.getElementById("sk-btns").classList.remove("hidden");
            }
        }
    }, 1000);
}

// Funktion für die Weiterleitung
function redirectToIndex() {
    window.location.href = "/status4.html";
}

// Event-Listener für die Buttons
document.getElementById("btn1").addEventListener("click", function () {
    toggleButtons("btn1", "btn2");
});

document.getElementById("btn2").addEventListener("click", function () {
    toggleButtons("btn2", "btnCountdown1");
    document.getElementById("btnCountdown2").classList.remove("hidden");
    document.getElementById("modal").style.display = "flex"; // Bild wird angezeigt
});

document.getElementById("btnCountdown1").addEventListener("click", function () {
    startCountdown("btnCountdown1", "countdown1", "btn3", "btnCountdown2", 20);
});

document.getElementById("btnCountdown2").addEventListener("click", function () {
    startCountdown("btnCountdown2", "countdown2", "btnCustom", "btnCountdown1", 0);
});
// Klick auf btnCustom: btnCustom ausblenden, SK-Buttons + btn4 einblenden
document.getElementById("btnCustom").addEventListener("click", function() {
    // btnCustom selbst verstecken
    this.classList.add("hidden");
  
    // SK-Buttons einblenden
    document.getElementById("sk-btns").classList.remove("hidden");
  
    // btn4 (Nächster QR-Scan) einblenden
    document.getElementById("btn4").classList.remove("hidden");
  });
  
document.getElementById("btn3").addEventListener("click", function () {
    toggleButtons("btn3", "btn4");
    // Wenn du willst, dass sk-btns auch hier erscheinen, kannst du folgende Zeile aktivieren:
    document.getElementById("sk-btns").classList.remove("hidden");
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

    scanQRCode();
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
    button.addEventListener('click', function () {
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

// Event-Listener für die Hervorhebung der SK-Buttons
const buttons = document.querySelectorAll('.sk-btn');

buttons.forEach(button => {
    button.addEventListener('click', function () {
        buttons.forEach(btn => btn.classList.remove('selected')); 
        this.classList.add('selected'); 
        const sichtung = this.getAttribute('data-sichtung');
        console.log('Daten gesichert für: ' + sichtung);
        localStorage.setItem('sichtung', sichtung);
    });
});
