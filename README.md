# Convertimelo

Una applicazione web completa per convertire file, valute, unità di misura e manipolare testo.

## Funzionalità

### 📄 Convertitore di File
- Converti file tra diversi formati (PNG, JPEG, WEBP, BMP, MP3, WAV)
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
- Copia risultati negli appunti con un click

## Tecnologie Utilizzate

### Frontend
- **Angular 17** - Framework principale
- **TypeScript** - Linguaggio di programmazione
- **RxJS** - Gestione asincrona
- **CSS** - Styling con gradients e animazioni
- **Python** - Linguaggio di programmazione per il convertitore di unità

### Backend e Database
- **Firebase**
  - Firestore - Database NoSQL per tracciamento conversioni
  - Functions - Funzioni serverless per operazioni backend

### API Esterne
- **Exchange Rate API** - Tassi di cambio in tempo reale
- **Browser Canvas API (client-side)** - La conversione dei file viene eseguita nel browser usando la Canvas API per caricare ed esportare file in formati diversi