# FEDGE 2.O — Trust Fund Game 🏦

A mobile strategy game where players manage a virtual trust fund, make high-stakes financial decisions, navigate real-world events, and compete to grow their wealth empire.

## Overview

FEDGE 2.O is a turn-based strategy mobile game built with React Native (Expo) on the frontend and Node.js on the backend. Players start with a trust fund seed, then make decisions across asset classes — crypto, real estate, stocks, and business ventures — while navigating random market events that can make or break their portfolio.

## Features

- 🎮 Turn-based decision engine with branching outcomes
- 📈 Dynamic asset simulation (stocks, crypto, real estate, ventures)
- ⚡ Random market events that shake up the game
- 🏆 Global leaderboard to compete with other players
- 💼 Portfolio screen with real-time net worth tracking
- 🔐 JWT-based auth so your progress is saved

## Tech Stack

| Layer     | Tech                          |
|-----------|-------------------------------|
| Mobile    | React Native (Expo)           |
| State     | React Context + useReducer    |
| Backend   | Node.js + Express             |
| Database  | MongoDB (Mongoose)            |
| Auth      | JWT (JSON Web Tokens)         |

## Project Structure

```
fedge2-trust-fund-game/
├── client/                  # React Native (Expo) mobile app
│   ├── App.js
│   ├── app.json
│   └── src/
│       ├── screens/         # HomeScreen, GameScreen, Portfolio, Leaderboard
│       ├── components/      # TrustFundCard, DecisionModal, AssetChart, EventCard
│       ├── game/            # Game engine, events, assets, decisions
│       ├── context/         # GameContext (global state)
│       └── utils/           # Formatters, helpers
└── server/                  # Node.js + Express API
    ├── index.js
    ├── routes/              # /game, /leaderboard, /auth
    ├── models/              # Player, GameState schemas
    └── middleware/          # Auth middleware
```

## Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- MongoDB instance (local or Atlas)

### Install & Run

**1. Clone the repo**
```bash
git clone https://github.com/YOUR_USERNAME/fedge2-trust-fund-game.git
cd fedge2-trust-fund-game
```

**2. Start the backend**
```bash
cd server
npm install
cp .env.example .env   # fill in MONGO_URI and JWT_SECRET
npm run dev
```

**3. Start the mobile app**
```bash
cd client
npm install
npx expo start
```

Scan the QR code with Expo Go on your phone, or press `i` for iOS simulator / `a` for Android emulator.

## Game Rules

1. You start with **$500,000** in your trust fund.
2. Each turn you receive **3 decisions** — choose wisely.
3. **Market events** fire randomly and affect your assets.
4. Game runs for **20 turns**. Highest net worth wins.
5. Submit your score to the global leaderboard.

## Contributing

Pull requests welcome. Open an issue first to discuss major changes.

## License

FEDGE 2.O Eclat Universe — Rafael Fellito Rodriguez Jr.

---

## 📋 License & Brand

![FEDGE 2.O Logo](FEDGE-2O-Logo.png)

### FEDGE 2.O | Powered by Rafael Fellito Rodriguez & Eclat Universe

**© 2026 FEDGE 2.O. All rights reserved.**

This project is part of the FEDGE 2.O ecosystem and is protected under full intellectual property rights reserved by Rafael Fellito Rodriguez and Eclat Universe.

### License Details

- **Type:** Proprietary - All Rights Reserved
- **Owner:** Rafael Fellito Rodriguez & Eclat Universe
- **Brand:** FEDGE 2.O
- **Status:** Protected & Confidential

### Key Rights

✓ **All intellectual property retained**
✓ **Reproduction prohibited without permission**
✓ **Distribution rights reserved**
✓ **Derivative works not permitted**
✓ **Commercial use requires authorization**

### Attribution

When referencing this software, please include:
- FEDGE 2.O
- Rafael Fellito Rodriguez
- Eclat Universe

### Inquiries

For licensing, partnerships, or usage permissions:
📧 **cryptofedge@gmail.com**

---

**Learn more:** [Full License](LICENSE)

---

---

## 📋 License & Brand

<img src="FEDGE-2O-Logo.png" alt="FEDGE 2.O Logo" width="120" height="120">

### FEDGE 2.O | Powered by Rafael Fellito Rodriguez & Eclat Universe

**© 2026 FEDGE 2.O. All rights reserved.**

This project is part of the FEDGE 2.O ecosystem and is protected under full intellectual property rights reserved by Rafael Fellito Rodriguez and Eclat Universe.

### License Details

- **Type:** Proprietary - All Rights Reserved
- **Owner:** Rafael Fellito Rodriguez & Eclat Universe
- **Brand:** FEDGE 2.O
- **Status:** Protected & Confidential

### Key Rights

✓ **All intellectual property retained**
✓ **Reproduction prohibited without permission**
✓ **Distribution rights reserved**
✓ **Derivative works not permitted**
✓ **Commercial use requires authorization**

### Attribution

When referencing this software, please include:
- FEDGE 2.O
- Rafael Fellito Rodriguez
- Eclat Universe

### Inquiries

For licensing, partnerships, or usage permissions:
📧 **cryptofedge@gmail.com**

---

**Learn more:** [Full License](LICENSE)

---

---

## License & Brand

<img src="FEDGE-2O-Logo.png" alt="FEDGE 2.O Logo" width="120" height="120">

### FEDGE 2.O | Powered by Rafael Fellito Rodriguez & Eclat Universe

**© 2026 FEDGE 2.O. All rights reserved.**

This project is part of the FEDGE 2.O ecosystem and is protected under full intellectual property rights reserved by Rafael Fellito Rodriguez and Eclat Universe.

### License Details

- **Type:** Proprietary - All Rights Reserved
- **Owner:** Rafael Fellito Rodriguez & Eclat Universe
- **Brand:** FEDGE 2.O
- **Status:** Protected & Confidential

### Key Rights

- All intellectual property retained
- Reproduction prohibited without permission
- Distribution rights reserved
- Derivative works not permitted
- Commercial use requires authorization

### Attribution

When referencing this software, please include:
- FEDGE 2.O
- Rafael Fellito Rodriguez
- Eclat Universe

### Inquiries

For licensing, partnerships, or usage permissions:
📧 **cryptofedge@gmail.com**

---

**Learn more:** [Full License](LICENSE)

---

