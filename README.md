# Convertimelo - Convertitore Universale 🔄

Una applicazione web completa per convertire immagini, valute, unità di misura e manipolare testo.

## Funzionalità

### 🖼️ Convertitore di Immagini
- Converti immagini tra diversi formati (PNG, JPEG, WEBP, BMP)
- Anteprima dell'immagine prima della conversione
- Salvataggio automatico su Firebase Storage
- Tracciamento delle conversioni su Firestore

### 💱 Convertitore di Valute
- Conversione in tempo reale tra 20+ valute
- Utilizzo di API esterne per tassi di cambio aggiornati
- Funzione di scambio rapido tra valute
- Supporto per le principali valute mondiali (USD, EUR, GBP, JPY, ecc.)

### 📏 Convertitore di Unità
- **Lunghezza**: metri, chilometri, miglia, piedi, pollici, centimetri
- **Peso**: chilogrammi, grammi, libbre, once, tonnellate
- **Temperatura**: Celsius, Fahrenheit, Kelvin
- **Volume**: litri, millilitri, galloni, once fluide, metri cubi
- Conversione in tempo reale mentre digiti

### 📝 Utilità Testo
- **Statistiche testo**: conta caratteri, parole, righe, frasi
- **Trasformazioni case**: MAIUSCOLO, minuscolo, Titolo, Frase
- **Operazioni**: rimuovi spazi extra, inverti testo, riassunto
- **Ricerca**: conta occorrenze di termini
- **Organizzazione**: rimuovi duplicati, ordina righe
- **Codifica**: Base64 encode/decode, URL encode/decode
- Copia risultati negli appunti con un click

## Tecnologie Utilizzate

### Frontend
- **Angular 17** - Framework principale
- **TypeScript** - Linguaggio di programmazione
- **RxJS** - Gestione asincrona
- **CSS3** - Styling con gradients e animazioni

### Backend e Database
- **Firebase**
  - Firestore - Database NoSQL per tracciamento conversioni
  - Storage - Archiviazione immagini convertite
  - Functions - Funzioni serverless per operazioni backend
  - Hosting - Deploy dell'applicazione

### API Esterne
- **Exchange Rate API** - Tassi di cambio in tempo reale

## Installazione

### Prerequisiti
- Node.js (v18 o superiore)
- npm (v10 o superiore)
- Account Firebase

### Setup

1. **Clone del repository**
```bash
git clone https://github.com/martinoparisi/convertimelo.git
cd convertimelo
```

2. **Installa le dipendenze**
```bash
npm install
cd functions
npm install
cd ..
```

3. **Configura Firebase**
- Crea un progetto su [Firebase Console](https://console.firebase.google.com/)
- Abilita Firestore Database
- Abilita Storage
- Copia le credenziali del progetto
- Aggiorna `src/environments/environment.ts` con le tue credenziali Firebase

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "TUA_API_KEY",
    authDomain: "TUO_AUTH_DOMAIN",
    projectId: "TUO_PROJECT_ID",
    storageBucket: "TUO_STORAGE_BUCKET",
    messagingSenderId: "TUO_MESSAGING_SENDER_ID",
    appId: "TUA_APP_ID"
  },
  currencyApiKey: "TUA_CURRENCY_API_KEY" // Opzionale
};
```

4. **Inizializza Firebase**
```bash
firebase login
firebase init
```

## Sviluppo

### Server di sviluppo locale
```bash
npm start
```
Apri il browser su `http://localhost:4200`

### Build di produzione
```bash
npm run build
```
I file compilati saranno in `dist/convertimelo`

### Firebase Emulators (sviluppo locale)
```bash
npm run serve
```
Questo avvierà gli emulatori per Firestore, Functions, Storage e Hosting

### Deploy su Firebase
```bash
firebase deploy
```

## Struttura del Progetto

```
convertimelo/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── image-converter/     # Componente convertitore immagini
│   │   │   ├── currency-converter/  # Componente convertitore valute
│   │   │   ├── unit-converter/      # Componente convertitore unità
│   │   │   └── text-utils/          # Componente utilità testo
│   │   ├── services/
│   │   │   ├── image-converter.service.ts
│   │   │   ├── currency-converter.service.ts
│   │   │   ├── unit-converter.service.ts
│   │   │   └── text-utils.service.ts
│   │   ├── app.component.ts
│   │   └── app.module.ts
│   ├── environments/
│   ├── assets/
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── functions/
│   └── src/
│       └── index.ts                 # Cloud Functions
├── firebase.json
├── firestore.rules
├── storage.rules
├── angular.json
├── package.json
└── README.md
```

## Uso

1. **Conversione Immagini**
   - Seleziona la tab "Immagini"
   - Carica un'immagine
   - Scegli il formato di destinazione
   - Clicca "Converti Immagine"
   - Scarica l'immagine convertita

2. **Conversione Valute**
   - Seleziona la tab "Valute"
   - Inserisci l'importo
   - Scegli la valuta di partenza e destinazione
   - Clicca "Converti" per vedere il risultato

3. **Conversione Unità**
   - Seleziona la tab "Unità"
   - Scegli la categoria (Lunghezza, Peso, ecc.)
   - Inserisci il valore
   - Seleziona unità di partenza e destinazione
   - Il risultato viene calcolato automaticamente

4. **Utilità Testo**
   - Seleziona la tab "Testo"
   - Scegli l'operazione desiderata
   - Inserisci il testo
   - Clicca "Elabora"
   - Copia il risultato se necessario

## Funzionalità Future

- [ ] Autenticazione utenti
- [ ] Storico conversioni personale
- [ ] Supporto per più formati immagine (SVG, GIF)
- [ ] Integrazione AI per riassunti testo avanzati
- [ ] API REST per conversioni programmatiche
- [ ] App mobile con Ionic
- [ ] Modalità offline con Service Workers
- [ ] Temi personalizzabili (dark mode)
- [ ] Esportazione batch di conversioni

## Contribuire

I contributi sono benvenuti! Per favore:

1. Fai un fork del progetto
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Commit delle modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## Licenza

Questo progetto è distribuito sotto licenza MIT.

## Autore

**Martino Parisi**

## Supporto

Per domande o problemi, apri una [issue](https://github.com/martinoparisi/convertimelo/issues) su GitHub.