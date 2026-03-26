# TapTip 💳

> Contactless NFC tipping for service providers — tap a lapel pin, send a tip instantly.

![TapTip](https://img.shields.io/badge/version-1.0.0-gold) ![React](https://img.shields.io/badge/React-18-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## Overview

TapTip lets guests tip valets, concierges, sommeliers, and other service staff by simply tapping their phone against an NFC-enabled lapel pin badge. No cash, no awkward moments — just a seamless luxury experience.

### Key Features

- **NFC Tap-to-Tip** — tap any NFC/RFID lapel badge to pull up the provider's profile
- **Guest Flow** — choose preset or custom tip amounts, add a note, send instantly
- **Provider Dashboard** — real-time earnings, tip history, payout management
- **Badge Registration** — link NFC badge IDs to provider profiles
- **Bank/Card Connect** — Stripe-ready payment and payout integration
- **Dual Mode** — seamlessly switch between Guest (tipper) and Provider (receiver) modes

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6 |
| Styling | CSS Variables, Google Fonts (Cormorant Garamond + DM Sans) |
| Payments | Stripe (integration-ready) |
| NFC | Web NFC API (`navigator.nfc`) |
| State | React Context API |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/taptip.git
cd taptip
npm install
npm start
```

The app runs at `http://localhost:3000`.

### Build for Production

```bash
npm run build
```

Output goes to `/build` — deploy to Vercel, Netlify, or any static host.

## Project Structure

```
taptip/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── BottomNav.jsx          # Tab bar navigation
│   │   ├── PhoneFrame.jsx         # Mobile device frame wrapper
│   │   └── TransactionRow.jsx     # Shared transaction list item
│   ├── context/
│   │   └── AppContext.jsx         # Global state (user, mode, transactions)
│   ├── pages/
│   │   ├── ScanPage.jsx           # NFC scan + provider profile reveal
│   │   ├── TipPage.jsx            # Tip amount entry + send
│   │   ├── SuccessPage.jsx        # Confirmation receipt
│   │   ├── RegisterBadgePage.jsx  # Register NFC badge (provider)
│   │   ├── DashboardPage.jsx      # Provider earnings dashboard
│   │   ├── WalletPage.jsx         # Balance, bank/card connect
│   │   └── ProfilePage.jsx        # Settings, mode switch
│   ├── utils/
│   │   └── nfc.js                 # Web NFC API helpers
│   ├── App.jsx
│   ├── index.jsx
│   └── styles/
│       └── globals.css
└── README.md
```

## NFC Integration

TapTip uses the **Web NFC API** (Chrome on Android, requires HTTPS):

```js
import { scanTag } from './utils/nfc';

const tag = await scanTag();
// Returns: { id: "MH-0041", providerName: "Étienne Valois", ... }
```

In the demo/development build, NFC is simulated with a tap gesture. In production, replace `utils/nfc.js` mock with real `NDEFReader` calls.

## Payment Integration (Stripe)

The wallet and payout flows are wired for Stripe Connect:

1. **Guests** pay via Stripe Payment Intents
2. **Providers** receive via Stripe Connect Express accounts
3. **Instant payouts** supported with Stripe Instant Payout API

Set your keys in `.env`:

```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_...
REACT_APP_API_URL=https://your-backend.com
```

## Deployment

### Vercel (recommended)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
netlify deploy --prod --dir=build
```

## Roadmap

- [ ] iOS NFC support (via Safari 17+ Web NFC)
- [ ] Provider team accounts (hotel/venue dashboard)
- [ ] Tip splitting for group service staff
- [ ] Receipt emails / SMS confirmations
- [ ] Admin venue portal
- [ ] Apple Pay / Google Pay express checkout

## License

MIT © TapTip
