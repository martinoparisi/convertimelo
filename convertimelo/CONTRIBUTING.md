# Contributing to Convertimelo

Thank you for your interest in contributing to Convertimelo! This document provides guidelines for contributing to the project.

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/convertimelo.git`
3. Install dependencies: `npm install`
4. Create a feature branch: `git checkout -b feature/your-feature-name`

## Code Style

- Follow Angular style guide
- Use TypeScript strict mode
- Write meaningful variable and function names in Italian (for consistency with UI)
- Comment complex logic
- Keep components focused and small

## Making Changes

1. Make your changes in your feature branch
2. Test your changes locally:
   ```bash
   npm start  # Run dev server
   npm run build  # Test production build
   ```
3. Commit with clear messages:
   ```bash
   git commit -m "Add: feature description"
   git commit -m "Fix: bug description"
   ```

## Pull Request Process

1. Update documentation if needed (README.md, SETUP.md)
2. Ensure the application builds without errors
3. Test all affected features manually
4. Push your branch and create a Pull Request
5. Describe your changes clearly in the PR description
6. Wait for review and address any feedback

## Adding New Features

### Adding a New Converter Type

1. Create a new component in `src/app/components/`
2. Create a corresponding service in `src/app/services/`
3. Add the component to `app.module.ts` declarations
4. Add a new tab button in `app.component.html`
5. Update documentation

Example:
```bash
ng generate component components/my-converter
ng generate service services/my-converter
```

### Adding New Unit Categories

Edit `src/app/services/unit-converter.service.ts`:

```typescript
{
  name: 'NuovaCategoria',
  baseUnit: 'unita_base',
  units: ['unita1', 'unita2', 'unita3'],
  factors: {
    'unita1': 1,
    'unita2': 2.5,
    'unita3': 0.5
  }
}
```

### Adding Currency Support

The currency list is in `src/app/services/currency-converter.service.ts`:

```typescript
getSupportedCurrencies(): string[] {
  return [
    'USD', 'EUR', 'GBP', // ... add more
  ];
}
```

### Adding Text Operations

Edit `src/app/services/text-utils.service.ts` and add your method:

```typescript
myNewOperation(text: string): string {
  // Your implementation
  return processedText;
}
```

Then update `src/app/components/text-utils/text-utils.component.ts` to call it.

## Firebase Integration

### Testing with Firebase Emulators

```bash
npm run serve  # Starts all Firebase emulators
```

This runs:
- Firestore on port 8080
- Functions on port 5001
- Hosting on port 5000
- Storage on port 9199

### Adding Cloud Functions

Edit `functions/src/index.ts`:

```typescript
export const myFunction = functions.https.onRequest(async (req, res) => {
  // Your function code
});
```

Build and test:
```bash
cd functions
npm run build
```

## Testing

### Manual Testing Checklist

- [ ] Image converter works with PNG, JPEG, WEBP, BMP
- [ ] Currency converter fetches live rates
- [ ] All unit categories convert correctly
- [ ] All text operations produce expected results
- [ ] UI is responsive on mobile and desktop
- [ ] No console errors
- [ ] Loading states work correctly
- [ ] Error messages are user-friendly

### Adding Automated Tests (Future)

We welcome contributions to add unit and e2e tests using:
- Jasmine/Karma for unit tests
- Cypress or Protractor for e2e tests

## Code Review

All contributions will be reviewed for:
- Code quality and style
- Functionality and correctness
- Performance considerations
- Security best practices
- Documentation completeness

## Reporting Bugs

When reporting bugs, please include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Browser and OS information

## Feature Requests

We welcome feature requests! Please:
- Check if the feature already exists
- Describe the use case
- Explain the expected behavior
- Consider providing a mock-up or example

## Questions?

If you have questions about contributing:
- Open an issue with the "question" label
- Check existing issues for similar questions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for making Convertimelo better! 🚀
