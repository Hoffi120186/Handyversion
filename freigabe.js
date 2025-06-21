console.log("✅ freigabe.js wurde geladen");

if (localStorage.getItem("appGesperrt") === "true") {
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

  const response = await fetch("./passwoerter.json", { cache: "no-store" });
  const data = await response.json();
  console.log("Geladene Passwörter:", data.passwoerter);

  let bereitsVerbrauchte = JSON.parse(localStorage.getItem("verbrauchtePW")) || [];

  if (bereitsVerbrauchte.includes(eingabe)) {
    alert("Dieses Passwort wurde bereits verwendet.");
    return;
  }

  if (data.passwoerter.includes(eingabe)) {
    localStorage.setItem("appGesperrt", "false");
    bereitsVerbrauchte.push(eingabe);
    localStorage.setItem("verbrauchtePW", JSON.stringify(bereitsVerbrauchte));
    location.reload();
  } else {
    alert("Falsches Passwort.");
  }
}
