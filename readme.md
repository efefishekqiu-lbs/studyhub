# StudyHub

## Projektets namn
**StudyHub**

## Tävlingskategori
- Alla kategorier

## Projekt- och teknisk beskrivning

StudyHub är en **fullstack-webbapplikation** med både ett funktionellt backend och ett modernt frontend. Fokus har legat på helheten: enkel navigering, tydlig struktur och funktioner som faktiskt hjälper användaren i vardagen.

Applikationen gör det möjligt att:
- Planera studier och skapa ett personligt schema
- Samla alla kurser/lektioner i en och samma dashboard
- Gå med i klasser via en unik klasskod
- Logga in och registrera ett eget konto

StudyHub innehåller även en **inbyggd AI‑chattbot** som kan:
- Hjälpa till att förenkla och förklara uppgifter
- Ge stöd kring studieteknik och information
- Automatiskt räkna hur många uppgifter som återstår

Applikationen har en tydlig **startsida** som förklarar vad StudyHub är och hur det fungerar. Efter inloggning hamnar användaren på sin **personliga dashboard**, där alla klasser och tillhörande lektioner visas.

## Externt producerade komponenter

Nedan listas de huvudsakliga bibliotek och tekniker som har använts i projektet. Dessa täcker allt från backend, säkerhet och autentisering till frontend-rendering och externa tjänster.

```json
"@supabase/supabase-js": "^2.47.16",
"@vanilla-primitives/styled": "^0.4.3",
"archiver": "^7.0.1",
"axios": "^1.13.2",
"bcrypt": "^6.0.0",
"body-parser": "^1.20.3",
"cookie-parser": "^1.4.7",
"crypto": "^1.0.1",
"ejs": "^3.1.10",
"express": "^4.21.2",
"express-rate-limit": "^7.5.0",
"express-session": "^1.18.2",
"express-slow-down": "^3.0.1",
"fs": "^0.0.1-security",
"jsonwebtoken": "^9.0.3",
"multer": "^2.0.2",
"nodemailer": "^7.0.12",
"path": "^0.12.7",
"session-file-store": "^1.5.0",
"xss-clean": "^0.1.4"
```

Utöver detta har vi även använt:
- **Tailwind CSS** i vissa `.ejs`-filer för snabb och responsiv design
- **CDN-lösningar** som jQuery
- En extern **AI-modell** för chattbot-funktionaliteten

## Installation

### Lokal installation

1. Klona projektet
2. Installera nodemon för live server.
```bash
   npm install -g nodemon
```
3. Installera beroenden:
   ```bash
   npm install
   ```
4. Starta applikationen:
   ```bash
   nodemon app.js
   ```

### Online-version

Applikationen finns även tillgänglig online:

👉 **[\[Länk till applikationen\]](https://studyhub-dusky.vercel.app/)**

**Gå med i klasser**

I applikationen kan du gå med i olika klasser genom att ange en klasskod. 
Varje kod motsvarar ett specifikt ämne.

**Tillgängliga klasser**

- Svenska
  Klasskod: ```A7F9K2QX```

- Idrott
  Klasskod: ```M4Z8L1TR```

- Mentorstid
  Klasskod: ```8TQX3A6M```

- Webbutveckling
  Klasskod: ```R2K7FJ9L```

**Så här gör du**

1. Logga in i applikationen
2. Välj alternativet "Gå med i klass"
3. Ange rätt klasskod
4. Du är nu med i klassen och får tillgång till dess innehåll 🎉
