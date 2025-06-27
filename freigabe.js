console.log("✅ freigabe.js wurde geladen");

const jetzt = Date.now();
const freigabeBis = parseInt(localStorage.getItem("freigabeBis"), 10);

// Wenn gesperrt oder Zeit abgelaufen → Passwort anzeigen
if (
  localStorage.getItem("appGesperrt") === "true" ||
  !freigabeBis ||
  jetzt > freigabeBis
) {
  zeigePasswortPopup();
}

function zeigePasswortPopup() {
  const overlay = document.createElement("div");
  overlay.innerHTML = `
    <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:center;z-index:9999;">
      <div style="background:#fff;padding:2em;border-radius:10px;text-align:center;max-width:90%;">
        <h3>App gesperrt</h3>
        <p>Bitte Passwort eingeben, um fortzufahren:</p>
        <input type="password" id="pwInput" style="padding:0.5em;width:80%;"><br><br>
        <button onclick="prüfePasswort()">Freischalten</button>
      </div>
    </div>
  `;
  document.body.innerHTML = "";
  document.body.appendChild(overlay);
}

async function prüfePasswort() {
  console.log("Passwort wird geprüft");
  const eingabe = document.getElementById("pwInput").value.trim();

  const response = await fetch("check.php", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({passwort: eingabe})
  });
  const data = await response.json();

  if(data.ergebnis === "ok") {
      localStorage.setItem("appGesperrt", "false");
      localStorage.setItem("freigabeBis", new Date(data.gueltigBis).getTime());
      location.reload();
  } else {
      alert("Falsches oder bereits verbrauchtes Passwort!");
  }
}
