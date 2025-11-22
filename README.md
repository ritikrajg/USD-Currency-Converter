# 💱 Currency Converter - Live Exchange Rates

A modern, responsive currency converter application built with React, TypeScript, and TailwindCSS. Get real-time exchange rates and convert between any currencies instantly.

![React](https://img.shields.io/badge/React-18.2.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.3-38bdf8.svg)

## ✨ Features

- 🔄 **Real-time Exchange Rates** - Fetches live currency rates from a reliable API
- 🌍 **Multi-Currency Support** - Convert between any supported currencies
- 💰 **Quick Amount Presets** - Fast selection with preset amounts (50, 100, 250, 500)
- 🔁 **Currency Swap** - Instantly swap base and target currencies
- 📊 **Rate Display** - Shows conversion rates in both directions
- 🎨 **Modern UI** - Beautiful, responsive design with TailwindCSS
- ⚡ **Fast & Lightweight** - Optimized performance with React hooks
- 📱 **Mobile Responsive** - Works seamlessly on all devices
- 🎯 **Type-Safe** - Built with TypeScript for better code quality

## 🚀 Technologies Used

- **React 18.2.0** - UI library
- **TypeScript 5.0** - Type safety
- **TailwindCSS 3.3.3** - Utility-first CSS framework
- **Create React App** - Build tooling
- **Currency API** - Real-time exchange rates from [currency-api.com](https://github.com/fawazahmed0/currency-api)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 14 or higher)
- **npm** (version 6 or higher) or **yarn**

## 🛠️ Installation

1. **Clone the repository** (or download as ZIP):
   ```bash
   git clone <repository-url>
   cd React-TailwindCSS-Starter-Pack-master
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

1. **Enter Amount**: Type the amount you want to convert in the input field, or click a quick preset button (50, 100, 250, 500)

2. **Select Base Currency**: Choose the currency you're converting from using the "From" dropdown

3. **Select Target Currency**: Choose the currency you're converting to using the "To" dropdown

4. **View Results**: The converted amount and exchange rates are displayed automatically

5. **Swap Currencies**: Click the "Swap" button to instantly exchange base and target currencies

6. **Reset**: Click "Reset" to clear the form and start fresh

## 📁 Project Structure

```
├── public/
│   ├── index.html          # HTML template
│   └── favicon.ico         # App icon
├── src/
│   ├── components/
│   │   ├── CurrencyConverter.tsx  # Main converter component
│   │   └── CurrencySelect.tsx     # Currency dropdown component
│   ├── hooks/
│   │   └── useCurrencyRates.ts    # Custom hook for fetching rates
│   ├── types/
│   │   └── currency.ts            # TypeScript type definitions
│   ├── App.tsx             # Root component
│   ├── index.tsx           # Entry point
│   └── index.css           # Global styles with TailwindCSS
├── .gitignore              # Git ignore file
├── package.json            # Dependencies and scripts
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.js      # TailwindCSS configuration
└── tsconfig.json           # TypeScript configuration
```

## 🎯 Available Scripts

In the project directory, you can run:

### `npm start`
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser. The page will reload if you make edits.

### `npm run build`
Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run eject`
**Note: this is a one-way operation. Once you `eject`, you can't go back!**

Ejects from Create React App, giving you full control over the build configuration.

## 🔌 API Information

This application uses the [Currency API](https://github.com/fawazahmed0/currency-api) via jsDelivr CDN to fetch real-time exchange rates. The API provides:

- Free access to currency exchange rates
- Daily updated rates
- Support for 150+ currencies
- No API key required

API Endpoint: `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/{base}.json`

## 🎨 Customization

### TailwindCSS Configuration
Modify `tailwind.config.js` to customize colors, spacing, fonts, and other design tokens.

### Adding New Features
- Components are located in `src/components/`
- Custom hooks can be added to `src/hooks/`
- Type definitions are in `src/types/`

## 🐛 Troubleshooting

### Issue: Dependencies not installing
**Solution**: Make sure you have Node.js 14+ installed. Try deleting `node_modules` and `package-lock.json`, then run `npm install` again.

### Issue: TailwindCSS styles not applying
**Solution**: Ensure `tailwind.config.js` includes all your source files in the `content` array.

### Issue: API not responding
**Solution**: Check your internet connection. The API is served via CDN and should be accessible worldwide.

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 👨‍💻 Development

### Code Style
- TypeScript strict mode enabled
- React functional components with hooks
- TailwindCSS utility classes for styling

### Best Practices
- Components are modular and reusable
- Custom hooks for data fetching logic
- TypeScript interfaces for type safety
- Error handling and loading states implemented

## 📚 Resources

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Create React App Documentation](https://create-react-app.dev/)
- [Currency API Documentation](https://github.com/fawazahmed0/currency-api)

## 🙏 Acknowledgments

- [Currency API](https://github.com/fawazahmed0/currency-api) for providing free exchange rate data
- [TailwindCSS](https://tailwindcss.com/) for the utility-first CSS framework
- [React](https://react.dev/) team for the amazing library

---

Made with ❤️ using React, TypeScript, and TailwindCSS
