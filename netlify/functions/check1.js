import fs from "fs";
import path from "path";

export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  // Passwort aus POST
  const { passwort } = JSON.parse(event.body);

  const filePath = path.resolve("netlify/functions/passwoerter.json");
  let passwoerter = JSON.parse(fs.readFileSync(filePath, "utf8"));

  let eintrag = passwoerter.find((pw) => pw.passwort === passwort);

  if (!eintrag) {
    return {
      statusCode: 200,
      body: JSON.stringify({ ergebnis: "fehler" }),
    };
  }

  if (eintrag.status === "used") {
    return {
      statusCode: 200,
      body: JSON.stringify({ ergebnis: "bereits genutzt" }),
    };
  }

  // gültig machen
  eintrag.status = "used";
  const ablauf = new Date();
  ablauf.setHours(ablauf.getHours() + eintrag.dauer);
  eintrag.gueltigBis = ablauf.toISOString();

  // speichern
  fs.writeFileSync(filePath, JSON.stringify(passwoerter, null, 2));

  return {
    statusCode: 200,
    body: JSON.stringify({
      ergebnis: "ok",
      gueltigBis: eintrag.gueltigBis,
    }),
  };
}
