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
3. Starta applikationen:
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

**Några bilder från studyhub**
<img width="1919" height="915" alt="image" src="https://github.com/user-attachments/assets/0ed4858a-2fba-42f5-8725-0713d538bddc" />
<img width="1919" height="907" alt="image" src="https://github.com/user-attachments/assets/ce2540e4-3891-4e42-83e2-d657f300edd0" />
<img width="1919" height="908" alt="image" src="https://github.com/user-attachments/assets/3a4da82c-dc1f-4503-8903-011a14eb8c92" />
<img width="1918" height="905" alt="image" src="https://github.com/user-attachments/assets/deb15a2a-7985-41f5-a048-5f37c12e3986" />
<img width="1919" height="904" alt="image" src="https://github.com/user-attachments/assets/45fe945e-f4b4-4783-bb03-d952a198760e" />
<img width="1919" height="907" alt="image" src="https://github.com/user-attachments/assets/a29ad184-5457-4bae-b744-3e4ce66d6815" />
<img width="619" height="906" alt="image" src="https://github.com/user-attachments/assets/98ddae3b-9e0c-4601-98c4-f98d2cc870e0" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/3f59dc45-3f8f-4f9e-8311-1b4e14c82cc4" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/3d1cc8cf-cafb-4a4b-903b-05618df46ecb" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/5b5ee6e1-c6b6-4838-9a1b-7e457a689c0e" />
<img width="1919" height="906" alt="image" src="https://github.com/user-attachments/assets/ba10d09d-3258-4ba2-9fee-37c51818405a" />
<img width="1919" height="907" alt="image" src="https://github.com/user-attachments/assets/5d057163-e2bf-419e-a970-b3d9319ff6e8" />
<img width="1919" height="909" alt="image" src="https://github.com/user-attachments/assets/88be6564-13d3-40cd-bfa4-c658f5a94f16" />
<img width="1917" height="904" alt="image" src="https://github.com/user-attachments/assets/91b5a14f-3500-464a-bc50-dbbbbe447b95" />
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/271deba1-96e8-4b56-8a5e-cda314522496" />
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/2364e38f-c7e0-451c-a71d-7ac3566e78f2" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/c47cb7fa-98f6-4142-9e9f-0d595af1bb46" />

**Bild från vårt database (supabase):**
<img width="1506" height="562" alt="image" src="https://github.com/user-attachments/assets/948ba1d2-bd79-43b7-939a-09030b7e1042" />
