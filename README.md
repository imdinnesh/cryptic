# 🔐 Cryptic - Advanced Encryption & Decryption Tool

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8)](https://tailwindcss.com/)

A modern, secure, and minimalistic web application for encrypting and decrypting text using advanced cryptographic algorithms. Built with **Next.js**, styled with **shadcn/ui**, and designed for both developers and security enthusiasts who need reliable encryption tools.

> 🚀 **Live Demo:** [crypto.starbyte.tech](https://crypto.starbyte.tech)

## 📸 Demo

<!-- Add your demo GIF or screenshot here -->
![Cryptic App Demo](https://via.placeholder.com/800x400?text=Demo+Screenshot+%2F+GIF+Here)

*Screenshot showing the encryption/decryption interface*

## 📚 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
- [How to Use](#-how-to-use)
- [Encryption Algorithms](#-encryption-algorithms)
- [Development](#-development)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

## ✨ Features

- 🔒 **AES Encryption** - Advanced Encryption Standard with CBC mode
- 🔓 **Secure Decryption** - Reliable decryption with proper key validation
- 🌓 **Dark/Light Theme** - Beautiful UI that adapts to your preference
- ⚡ **Client-Side Processing** - All encryption happens in your browser
- 🧩 **Modern Components** - Built with shadcn/ui for excellent UX
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- 🔐 **Key Management** - Support for multiple encryption keys and environments
- 📋 **Copy to Clipboard** - Easy sharing of encrypted/decrypted content
- 🎨 **JSON Highlighting** - Syntax highlighting for JSON responses
- 🔄 **Real-time Processing** - Instant encryption and decryption
- 📦 **No Backend Required** - Completely client-side for maximum security

## 🛠️ Tech Stack

### Frontend
- **[Next.js 15.3.3](https://nextjs.org/)** - React framework for production
- **[React 19](https://react.dev/)** - Latest React with concurrent features
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety and better DX
- **[Tailwind CSS 4.0](https://tailwindcss.com/)** - Utility-first CSS framework

### UI Components
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful, accessible React components
- **[Radix UI](https://www.radix-ui.com/)** - Low-level UI primitives
- **[Lucide React](https://lucide.dev/)** - Beautiful icons
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications

### Cryptography
- **[crypto-js](https://github.com/brix/crypto-js)** - JavaScript cryptography library

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting
- **[PostCSS](https://postcss.org/)** - CSS processing
- **[next-sitemap](https://github.com/iamvishnusankar/next-sitemap)** - Sitemap generation

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** ≥ 18.0.0 ([Download here](https://nodejs.org/))
- **npm**, **yarn**, or **pnpm** (npm comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/imdinnesh/cryptic.git
   cd cryptic
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment** (optional)
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration if needed
   ```

### Running Locally

1. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

2. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

3. **Build for production** (optional)
   ```bash
   npm run build
   npm run start
   ```

## 🎯 How to Use

### Basic Encryption/Decryption Flow

1. **Choose Your Operation**
   - Select either "Encrypt" or "Decrypt" tab in the interface

2. **Enter Your Content**
   - **For Encryption**: Paste your plain text in the input area
   - **For Decryption**: Paste your encrypted text (Base64 encoded)

3. **Provide Encryption Key**
   - Enter your AES encryption key (Base64 encoded)
   - The tool supports environment-specific keys (dev, uat, staging, prod)

4. **Process Your Data**
   - Click the "Encrypt" or "Decrypt" button
   - The result will appear in the output area

5. **Copy Results**
   - Use the copy button to copy the result to your clipboard
   - JSON responses are automatically formatted with syntax highlighting

### Example Usage

**Encrypting Text:**
```
Input: "Hello, World!"
Key: "your-base64-encoded-key-here"
Output: "base64-encrypted-string"
```

**Decrypting Text:**
```
Input: "base64-encrypted-string"
Key: "your-base64-encoded-key-here"
Output: "Hello, World!"
```

## 🔐 Encryption Algorithms

### AES (Advanced Encryption Standard)
- **Mode**: CBC (Cipher Block Chaining)
- **Key Size**: 256-bit (when using Base64 encoded keys)
- **Padding**: PKCS#7
- **IV**: Randomly generated for each encryption (16 bytes)

### Security Features
- **Client-side processing**: All encryption happens in your browser
- **No data transmission**: Your keys and data never leave your device
- **Secure random IV**: Each encryption uses a unique initialization vector
- **Industry standard**: Uses well-tested AES encryption algorithm

## 💻 Development

### Project Structure
```
cryptic/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── form.tsx          # Main encryption/decryption form
│   ├── theme-provider.tsx # Theme context provider
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility libraries
│   ├── crypto.ts         # Encryption/decryption functions
│   ├── format.ts         # Data formatting utilities
│   └── utils.ts          # General utilities
└── public/               # Static assets
```

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run postbuild` - Generate sitemap after build

### Adding New Features

1. **New Encryption Algorithms**: Extend `lib/crypto.ts`
2. **UI Components**: Add to `components/ui/` following shadcn/ui patterns
3. **Styling**: Use Tailwind CSS classes in components
4. **Theme Support**: Leverage the existing theme provider

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/cryptic.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add comments for complex logic
   - Ensure responsive design

4. **Test your changes**
   ```bash
   npm run build
   npm run lint
   ```

5. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```

6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **Open a Pull Request**
   - Provide a clear description of your changes
   - Include screenshots for UI changes
   - Reference any related issues

### Contribution Guidelines

- **Code Style**: Follow the existing TypeScript and React patterns
- **Components**: Use shadcn/ui components when possible
- **Styling**: Prefer Tailwind CSS utility classes
- **Security**: Never compromise on cryptographic security
- **Performance**: Consider impact on bundle size and runtime performance
- **Accessibility**: Ensure all UI components are accessible

### Areas for Contribution

- 🔐 Additional encryption algorithms (RSA, Blowfish, etc.)
- 🎨 UI/UX improvements and animations
- 📱 Mobile experience enhancements
- 🔧 Performance optimizations
- 📖 Documentation improvements
- 🧪 Test coverage (unit tests, integration tests)
- 🌐 Internationalization (i18n)

## 📄 License

This project is licensed under the MIT License - see the details below:

```
MIT License

Copyright (c) 2024 Cryptic

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 📞 Support

### Getting Help

- **📖 Documentation**: Check this README and inline code comments
- **🐛 Bug Reports**: [Open an issue](https://github.com/imdinnesh/cryptic/issues/new)
- **💡 Feature Requests**: [Start a discussion](https://github.com/imdinnesh/cryptic/discussions)
- **🔒 Security Issues**: Please report security vulnerabilities privately

### Resources

- **Live Demo**: [crypto.starbyte.tech](https://crypto.starbyte.tech)
- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
- **shadcn/ui Components**: [ui.shadcn.com](https://ui.shadcn.com)
- **Tailwind CSS**: [tailwindcss.com/docs](https://tailwindcss.com/docs)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by [Dinesh](https://github.com/imdinnesh)

</div>


