# Convertimelo

Convertimelo è una potente applicazione web "All-in-One" per la conversione e la manipolazione di file, unità di misura, valute e testo. Costruita con le più recenti tecnologie web, porta la potenza di strumenti desktop direttamente nel browser grazie a WebAssembly e Python-in-the-browser.

## 🚀 Funzionalità Principali

### 📂 Convertitore File

Converti file multimediali e documenti direttamente nel tuo browser senza caricare dati su server esterni (privacy garantita!).

- **Immagini**: Converti tra JPG, PNG, WEBP, GIF. Ridimensiona e comprimi.
- **Audio/Video**: Converti MP4, MP3, WAV usando la potenza di **FFmpeg.wasm**.
- **Documenti**: Converti immagini e testo in PDF.
- **Tecnologia**: Utilizza `FFmpeg.wasm` e `jsPDF` per elaborazioni client-side veloci e sicure.

### 📏 Convertitore Unità

Conversioni precise e complesse gestite da una vera libreria Python.

- Supporta lunghezze, pesi, temperature, volumi e molto altro.
- **Tecnologia**: Utilizza **Pyodide** per eseguire la libreria Python `pint` direttamente nel browser.

### 💱 Convertitore Valuta

Tassi di cambio aggiornati in tempo reale.

- Supporta le principali valute mondiali (USD, EUR, GBP, JPY, ecc.).
- **Tecnologia**: Integrazione con API di tassi di cambio in tempo reale.

### 📝 Manipolatore di Testo

Strumenti avanzati per la formattazione e l'analisi del testo.

- Trasformazioni (maiuscolo/minuscolo), pulizia, e analisi.
- **Tecnologia**: Elaborazione basata su script Python eseguiti via Pyodide.

### 🤖 Genkit AI

Generatore di contenuti intelligente.

- Crea testi, riassunti o idee creative partendo da un prompt.
- **Tecnologia**: Integrazione con **Google Gemini** (Generative AI).

### 🔐 Autenticazione e Dashboard

- Sistema di Login e Registrazione sicuro.
- Dashboard personale per accedere rapidamente a tutti gli strumenti.
- Cronologia delle conversioni (salvata localmente o su cloud).
- **Tecnologia**: **Firebase Authentication**.

## 🛠️ Stack Tecnologico

Il progetto è sviluppato come una Single Page Application (SPA) moderna:

- **Frontend Framework**: [Angular](https://angular.io/) (v17+)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) per un design responsivo e moderno.
- **Python in Browser**: [Pyodide](https://pyodide.org/) (WebAssembly) per eseguire codice Python client-side.
- **Media Processing**: [FFmpeg.wasm](https://ffmpegwasm.netlify.app/) per manipolazione audio/video.
- **Backend/Auth**: [Firebase](https://firebase.google.com/) (Auth & Hosting).
- **AI**: Google Generative AI (Gemini).

## 📦 Installazione e Avvio

### Prerequisiti

- [Node.js](https://nodejs.org/) (versione LTS raccomandata)
- [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)

### Setup del Progetto

1. **Installa le dipendenze**:
   ```bash
   npm install
   ```

### Avvio in Sviluppo

Per avviare il server di sviluppo locale:

```bash
ng serve
```

Apri il browser all'indirizzo `http://localhost:4200/`. L'applicazione si ricaricherà automaticamente se modifichi i file sorgente.

## ⚠️ Note Importanti

- **Primo Caricamento**: Al primo avvio, l'applicazione scaricherà i binari WebAssembly per Pyodide e FFmpeg. Questo potrebbe richiedere alcuni secondi a seconda della velocità della connessione. I caricamenti successivi saranno molto più veloci grazie alla cache.
- **Browser Supportati**: Si consiglia l'uso di browser moderni (Chrome, Edge, Firefox, Safari) per il pieno supporto di WebAssembly e delle API moderne.

## 🤝 Contribuire

Le Pull Request sono benvenute! Per modifiche importanti, apri prima una issue per discutere cosa vorresti cambiare.

## 📄 Licenza

[MIT](LICENSE)
