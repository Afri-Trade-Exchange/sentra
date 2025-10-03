# 🌍 Sentra

> ⚠️ **BETA NOTICE**: This software is currently in beta and should be considered a Minimum Viable Product (MVP). While functional, it may contain bugs and features might change significantly during development. Use in production environments is not recommended at this stage.

## 📝 Project Overview
Sentra is an innovative web application designed to revolutionize trade customs processes across Africa, reducing wait times and streamlining invoice management for businesses.

## 🚀 Key Objectives
- Reduce trade processing time by 50%
- Simplify cross-border invoice management
- Provide real-time tracking of trade documents

## 🛠 Tech Stack
### Frontend
- React (v18+)
- TypeScript
- Vite
- React Router
- Tailwind CSS

### State Management
- Redux Toolkit
- React Query

### Authentication
- Firebase Authentication
- JWT Token Management

## 💻 Development Environment

### Prerequisites
- Node.js (v18+ recommended)
- npm (v8+) or yarn (v1.22+)
- Git

### Local Setup

#### 1. Clone the Repository
```bash
# HTTPS
git clone https://github.com/[your-username]/AfriTradeXchange.git

# SSH
git clone git@github.com:[your-username]/AfriTradeXchange.git

cd AfriTradeXchange
```

#### 2. Install Dependencies
```bash
# Using npm
npm install

# Using yarn
yarn install
```

#### 3. Environment Configuration
Create a `.env` file in the root directory:
```bash
# API Configuration
VITE_API_URL=https://your-backend-api.com
VITE_AUTH_TOKEN=your_auth_token

# Firebase Configuration
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
```

#### 4. Run the Application
```bash
# Development mode
npm run dev
# or
yarn dev

# Production build
npm run build
yarn build

# Run tests
npm test
yarn test
```

## 📂 Project Structure
```
AfriTradeXchange/
├── src/
│   ├── Components/       # Reusable React components
│   ├── Pages/            # Page-level components
│   ├── Services/         # API and data fetching logic
│   ├── Types/            # TypeScript type definitions
│   ├── Utils/            # Utility functions
│   ├── Hooks/            # Custom React hooks
│   ├── Context/          # React context providers
│   └── Assets/           # Static assets
├── tests/                # Unit and integration tests
├── public/               # Public assets
└── config/               # Configuration files
```

## ✨ Key Features
- 📄 Invoice Management System
- 🔐 Secure User Authentication
- 📊 Real-time Trade Tracking
- 💱 Multi-currency Support
- 📈 Detailed Analytics Dashboard
- 

## 🤝 Contributing Guidelines

### Branch Strategy
- `main`: Stable production code
- `develop`: Active development branch
- `feature/`: New feature branches
- `bugfix/`: Bug resolution branches

### Contribution Steps
1. Fork the repository
2. Create a feature branch 
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit changes with descriptive messages
   ```bash
   git commit -m "feat: Add user authentication flow"
   ```
4. Push to your branch
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request to `develop` branch

### Code Quality
- Follow TypeScript best practices
- Write unit tests for new features
- Ensure code passes linting checks
- Maintain consistent code formatting

## 🔍 Design Reference
- **Figma Design**: [AfriTradeXchange Design](https://www.figma.com/design/vlRSgTtDI16oqmczgsBs9N/AfriTradeXchange)

## 📜 License
MIT License

Copyright (c) 2024 AfriTradeXchange

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

**Beta Software Disclaimer**: This software is provided as a Minimum Viable Product (MVP) and is still in beta testing phase. Users should be aware that:
- Features may be incomplete or subject to change
- Bugs and issues are expected
- Data persistence and stability are not guaranteed
- Not ready for production

## 📞 Support
For issues or questions, please open a GitHub issue or contact martinwangata@gmail.com
