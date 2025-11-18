# Setup Guide - Convertimelo

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase (Optional for Development)

The application works without Firebase in development mode. Images are converted locally using HTML5 Canvas API.

For production with Firebase integration:

1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Firestore Database, Storage, and Functions
3. Copy your Firebase config to `src/environments/environment.ts`

Example configuration:
```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  },
  currencyApiKey: "YOUR_CURRENCY_API_KEY" // Optional
};
```

### 3. Run Development Server

```bash
npm start
```

Navigate to `http://localhost:4200/`

## Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/convertimelo/` directory.

## Deploy to Firebase

```bash
firebase login
firebase init  # Select Hosting, Firestore, Storage, and Functions
firebase deploy
```

## Features Overview

### Image Converter
- Converts between PNG, JPEG, WEBP, and BMP formats
- Client-side conversion using HTML5 Canvas
- Automatic download of converted images
- Preview before conversion

### Currency Converter
- Real-time exchange rates from public API
- Support for 20+ major currencies
- Quick swap between currencies
- Works without additional API key (uses free Exchange Rate API)

### Unit Converter
- **Length**: meters, kilometers, miles, feet, inches, centimeters
- **Weight**: kilograms, grams, pounds, ounces, tons
- **Temperature**: Celsius, Fahrenheit, Kelvin (with proper conversion formulas)
- **Volume**: liters, milliliters, gallons, fluid ounces, cubic meters
- Real-time conversion as you type

### Text Utilities
- **Statistics**: character, word, line, and sentence count
- **Case transformations**: UPPERCASE, lowercase, Title Case, Sentence case
- **Text operations**: trim spaces, reverse text, summarize (first 3 sentences)
- **Search**: count occurrences of search terms
- **Organization**: remove duplicate lines, sort lines alphabetically
- **Encoding**: Base64 encode/decode, URL encode/decode
- Copy results to clipboard with one click

## Architecture

### Frontend (Angular 17)
- **Components**: Modular components for each converter type
- **Services**: Dedicated services for business logic
- **Styling**: CSS3 with gradient backgrounds and responsive design
- **Forms**: FormsModule for two-way data binding

### Backend (Firebase - Optional)
- **Firestore**: NoSQL database for conversion history
- **Storage**: Store converted images
- **Functions**: Serverless functions for statistics and cleanup
- **Rules**: Configured security rules for database and storage

## API Usage

### Currency Conversion
The application uses the free Exchange Rate API:
- Endpoint: `https://api.exchangerate-api.com/v4/latest/{base_currency}`
- No API key required
- Rate limit: Standard free tier limits apply

For production, consider using a premium API service for better reliability and higher rate limits.

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development Tips

### Running Firebase Emulators Locally
```bash
npm run serve
```

This starts Firebase emulators for Firestore, Functions, Storage, and Hosting.

### Testing Components
The application can be tested manually by:
1. Opening each tab (Images, Currency, Units, Text)
2. Testing various inputs and operations
3. Verifying results are correct

### Common Issues

**Image conversion not working:**
- Ensure browser supports HTML5 Canvas API
- Check file is a valid image format
- Try a different browser

**Currency conversion fails:**
- Check internet connection
- Verify API endpoint is accessible
- Check browser console for errors

**Firebase features not working:**
- Ensure Firebase config is correct
- Check Firebase project is enabled
- Verify security rules allow access

## File Structure

```
src/
├── app/
│   ├── components/          # UI Components
│   │   ├── image-converter/
│   │   ├── currency-converter/
│   │   ├── unit-converter/
│   │   └── text-utils/
│   ├── services/            # Business Logic
│   │   ├── image-converter.service.ts
│   │   ├── currency-converter.service.ts
│   │   ├── unit-converter.service.ts
│   │   └── text-utils.service.ts
│   ├── app.component.*      # Main App Component
│   └── app.module.ts        # App Module
├── environments/            # Environment Configs
├── assets/                  # Static Assets
├── index.html              # Main HTML
├── main.ts                 # Bootstrap
└── styles.css              # Global Styles

functions/
└── src/
    └── index.ts            # Cloud Functions

firebase.json               # Firebase Config
firestore.rules            # Firestore Security Rules
storage.rules              # Storage Security Rules
```

## License

MIT License - See LICENSE file for details
