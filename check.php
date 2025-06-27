
<?php
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("Access-Control-Allow-Origin: https://app.1rettungsmittel.de");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Length: 0");
    header("Content-Type: text/plain");
    http_response_code(204);
    exit;
}
// CORS erlauben
header("Access-Control-Allow-Origin: https://app.1rettungsmittel.de");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");



// Passwort aus POST abholen
$data = json_decode(file_get_contents("php://input"), true);
$userPasswort = $data["passwort"] ?? "";

$passwortDatei = "passwoerter.json";
$liste = json_decode(file_get_contents($passwortDatei), true);

$gefunden = false;

foreach ($liste as &$eintrag) {
    if ($eintrag["passwort"] === $userPasswort && $eintrag["status"] === "unused") {
        // Treffer, Passwort noch nicht genutzt
        $gefunden = true;
        $eintrag["status"] = "used";
        
        // Ablaufzeit berechnen (z.B. 12 Stunden ab jetzt)
        $ablaufZeit = time() + (12 * 60 * 60);
        $eintrag["gueltigBis"] = date("c", $ablaufZeit); // ISO 8601
        
        // Antwort an den Client
        $response = [
            "ergebnis" => "ok",
            "gueltigBis" => $eintrag["gueltigBis"]
        ];
        // Datei speichern
        file_put_contents($passwortDatei, json_encode($liste, JSON_PRETTY_PRINT));
        echo json_encode($response);
        exit;
    }
}

// nichts gefunden
echo json_encode(["ergebnis" => "fehler"]);
exit;
?>
