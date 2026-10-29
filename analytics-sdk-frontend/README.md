# Analytics SDK & Dashboard - Frontend

A React and Vite single-page application that demonstrates real-time event tracking through a custom zero-dependency browser SDK, a restaurant menu simulation, and an interactive analytics dashboard.

---

## ✨ Features

- **Vanilla JS Browser SDK (`analytics-sdk.js`)**: Automatically tracks page views, user actions, and custom events, queueing them locally and flushing them via `fetch` or `navigator.sendBeacon`.
- **Restaurant Demo App**: Interactive menu items and checkout flow simulating real user interactions and order creation.
- **Interactive Analytics Dashboard**: Powered by **Recharts** and **Tailwind CSS v4**, featuring metric summary cards (Total Page Views, Unique Visitors, Total Orders, Total Events) and time-series trend lines.
- **Date-Range Filtering**: Easily toggle data views between `24H`, `7D`, and `30D`.

---

## 🚀 Local Setup & Installation

### Prerequisites
- Node.js (v18+ recommended) & npm

### 1. Install Dependencies
```bash
cd analytics-sdk-frontend
npm install
