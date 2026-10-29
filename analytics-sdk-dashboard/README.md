# Full-Stack Analytics SDK & Dashboard

A lightweight, high-performance, full-stack analytics tracking system consisting of a zero-dependency vanilla JavaScript browser SDK, an asynchronous Laravel ingestion API, a background queue worker with MySQL bulk persistence, and a React + Vite dashboard powered by Recharts and Tailwind CSS.

---

## 🚀 Architecture & System Design

1. **Browser SDK (`analytics-sdk.js`)**:
   - Zero-dependency tracker capturing page views and custom business events.
   - Local event batching queue with automatic interval flushing and lifecycle tracking (`navigator.sendBeacon` on page unload to eliminate data loss).
2. **Backend Ingestion & Queue Pipeline (Laravel + MySQL)**:
   - **Endpoint:** `POST /api/v1/events` validates incoming batched payloads.
   - **Asynchronous Processing:** Dispatches payloads to `StoreEventsJob` via queue workers to prevent blocking HTTP threads.
   - **Idempotency:** Utilizes ULID event IDs (`event_id`) combined with database-level `insertOrIgnore` bulk operations to gracefully handle network retries and prevent duplicates.
3. **Analytics Dashboard API & Frontend (React + Vite + Tailwind + Recharts)**:
   - High-performance SQL aggregations for summary counts, unique visitors (`COUNT(DISTINCT distinct_id)`), traffic trends, and popular pages across customizable time ranges (`24h`, `7d`, `30d`).
   - Responsive UI featuring metric cards and time-series line charts.

---

## 🛠️ Local Setup Instructions

### Prerequisites
- PHP 8.2+ & Composer
- Node.js & npm
- MySQL / SQLite

### 1. Backend Setup (Laravel)
```bash
# Clone repository and enter backend directory
cd analytics-sdk-dashboard

# Install PHP dependencies
composer install

# Copy environment configuration & generate key
cp .env.example .env
php artisan key:generate

# Configure your database connection in .env, then run migrations
php artisan migrate

# Start the Laravel development server
php artisan serve --port=8000