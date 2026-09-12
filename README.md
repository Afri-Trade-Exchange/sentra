# 🌍 Sentra

## 📝 What is Sentra?

Sentra is a web platform that clears cross-border trade paperwork between traders and customs officers across Africa. A trader uploads their import/export documents once, gets back a QR code tied to that verified consignment, and a customs officer scans it at the border to instantly pull up everything needed to clear it — no more chasing paperwork by phone or email.

## ✨ Key Features

### For traders
- Document upload for import/export paperwork, tied to a consignment
- Auto-generated QR code per consignment for border clearance
- Consignment status tracking with a visual timeline
- Invoice detail view and PDF export (jsPDF)
- Dashboard analytics (charts via Recharts) and in-app notifications

### For customs officers
- QR scanner (camera-based, via `html5-qrcode`) to pull up a trader's documents instantly
- Consignment queue with search, status filters, and bulk actions
- Analytics overview and recent-activity feed
- Guided in-app tour and contextual help for onboarding officers

### Public site
- Marketing/landing page with a product walkthrough video
- Public shipment tracking by order number
- Separate sign-up/sign-in flows for traders vs. customs officers (`/trader-signup`, `/customs-login`)

## 🛠 Tech Stack

- **Framework**: React 18 + TypeScript, built with Vite 5
- **Styling**: Tailwind CSS, Framer Motion (animation), Headless UI
- **Routing**: React Router v6
- **Auth & data**: Firebase Authentication + Firestore
- **Forms & validation**: React Hook Form + Zod
- **QR codes**: `html5-qrcode` (scanning), `qrcode.react` (generation)
- **Charts**: Recharts, Chart.js (`react-chartjs-2`)
- **Documents/exports**: jsPDF + jspdf-autotable, html2canvas, `xlsx`, PapaParse, FileSaver
- **Notifications**: react-hot-toast, react-toastify
- **Testing**: Cypress (component + e2e), run in CI via GitHub Actions
- **Linting**: ESLint + typescript-eslint

## 💻 Local Development

### Prerequisites
- Node.js 18+
- npm 8+

### Setup

```bash
git clone https://github.com/Afri-Trade-Exchange/afritrade-xchange.git
cd afritrade-xchange
npm install
```

Copy `.env.example` to `.env` and fill in your own Firebase project credentials:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

> `src/firebase/firebaseConfig.ts` currently falls back to a hardcoded dev Firebase project if these are unset, so the app will still run without a `.env` file — but you should use your own project for anything beyond quick local testing.

### Scripts

```bash
npm run dev       # start the Vite dev server (http://localhost:5173)
npm run build     # type-check (tsc -b) then build for production
npm run preview   # preview the production build locally
npm run lint      # run ESLint
```

Cypress tests run in CI on every push (`.github/workflows/cypress.yml`); there's no `npm test` script yet, so run Cypress directly (`npx cypress open` / `npx cypress run`) if you want to run them locally.

## 🗺️ Routes

| Path | Description |
|---|---|
| `/` | Landing page |
| `/trader-signup` | Trader sign-up |
| `/login` | Trader sign-in |
| `/customs-login` | Customs officer sign-in |
| `/contact` | Contact / support |
| `/dashboard` | Trader dashboard *(protected)* |
| `/customs-dashboard` | Customs officer dashboard *(protected)* |
| `/settings` | Account settings |

## 📂 Project Structure

```
afritrade-xchange/
├── src/
│   ├── App.tsx                     # Routes + the full landing page
│   ├── Components/
│   │   ├── Dashboard.tsx           # Trader dashboard
│   │   ├── Dashboard/              # Trader dashboard subcomponents
│   │   ├── CustomsDashboard.tsx    # Customs officer dashboard
│   │   ├── CustomsDashboard/       # Customs dashboard subcomponents
│   │   ├── Layout.tsx              # Site header/nav shell
│   │   ├── Footer.tsx
│   │   ├── AuthContext.tsx / ProtectedRoute.tsx
│   │   ├── TraderSignup.tsx / LoginPage.tsx / ContactPage.tsx / Settings.tsx
│   │   └── ...
│   ├── firebase/                   # Firebase auth + Firestore config
│   ├── types/                      # Shared TypeScript types
│   └── assets/                     # Images, video, icons
├── cypress/                        # Cypress test setup
├── .github/workflows/              # CI (Cypress)
└── dist/                           # Production build output
```

## 🤝 Contributing

1. Create a feature branch off `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Commit with descriptive messages (e.g. `feat: add bulk clearance action`)
3. Push and open a Pull Request against `main`
4. Make sure `npm run lint` and `npm run build` pass before requesting review

## 📜 License

MIT License — Copyright (c) 2024 Sentra / AfriTradeXchange

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

**Beta Software Disclaimer**: Sentra is an MVP in active development.
- Features may be incomplete or subject to change without notice
- Bugs are expected
- Not ready for production use

## 📞 Support

Open a GitHub issue, or reach out at martinwangata@gmail.com.
