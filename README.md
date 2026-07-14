# LernAPP

Modern, minimalistisch, im Apple-Stil. Gebaut mit React + Vite, bereit für Vercel.

## Struktur

- `LandingPage.jsx` – Startseite mit animierter Headline und Call-to-Action
- `LoginPage.jsx` – cleaner Login-Screen (clientseitige Validierung, kein Backend)
- `HomePage.jsx` – Hauptbereich nach dem Login
- `ActionCards.jsx` – manuelle Frageneingabe + Datei-Upload (PDF/DOCX/XLSX)
- `LoadingBar.jsx` – wiederverwendbarer animierter Ladebalken
- `useTheme.js` – Light/Dark-Mode-Logik (persistiert in `localStorage`)
- `index.css` – Design-System (Farben, Typografie, Animationen)

## Entwicklung

```bash
npm install
npm run dev
```

## Deployment (Vercel)

Framework wird automatisch als Vite erkannt (`vercel.json` ist explizit gesetzt).
Build-Command: `vite build`, Output: `dist`.

## Nächste Schritte

- Echte Themen-Verwaltung (Fächer, Kategorien)
- Backend für Login/Registrierung
- Automatischer Import aus hochgeladenen Dateien (PDF/DOCX/XLSX-Parsing)
