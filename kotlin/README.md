# 🍛 Bhojnify (MessMate) — Idiomatic Kotlin Platform

Welcome to **Bhojnify** (formerly MessMate) in **Kotlin**, a complete, production-grade port and multi-module ecosystem for campus-kitchen and mess management.

This codebase provides local-first state persistence, reactive coroutines-based state management, full bilingual internationalization (English & Marathi), a Netty-backed Ktor REST API microservice, a Jetpack Compose Android application, a standalone CLI runner, and an extensive unit test suite.

---

## 🏗️ Architecture & Project Modules

The project is structured as a modern Kotlin multi-module Gradle project:

```
kotlin/
├── bhojnify-core/          # Pure Kotlin domain, models, StateFlow manager, i18n, services & calculations
│   ├── src/main/kotlin/com/bhojnify/core/
│   │   ├── model/          # 15+ Data classes & enums (Customer, LeaveRequest, Inventory, etc.)
│   │   ├── i18n/           # English & Marathi translations with dynamic variable interpolation
│   │   ├── service/        # DateUtils & ReportCalculator (P&L, valuations, meal counts)
│   │   ├── repository/     # In-memory & JSON file-based local-first persistence
│   │   └── state/          # MessStateManager (reactive StateFlow with business mutations)
│   └── src/test/kotlin/    # JUnit 5 & Kotlin test suites for core domain logic
│
├── bhojnify-server/        # Asynchronous Ktor 3.x REST API microservice (Netty engine)
│   ├── src/main/kotlin/com/bhojnify/server/
│   │   ├── plugins/        # Routing, ContentNegotiation (JSON), CORS, CallLogging
│   │   ├── routes/         # Healthcheck and RESTful CRUD endpoints (/api/state, /customers, /leaves, etc.)
│   │   └── Application.kt  # Server entry point running on port 8080
│   └── src/main/resources/ # application.conf and logback.xml
│
├── bhojnify-android/       # Modern Android application built with Jetpack Compose & Material 3
│   ├── src/main/kotlin/com/bhojnify/android/
│   │   ├── theme/          # Bhojnify warm campus-kitchen palette (Primary Green, Accent Yellow, Cream Cards)
│   │   ├── components/     # Reusable UI widgets (Header, StatCard, Badge, FormField, PrimaryButton)
│   │   ├── viewmodel/      # Architecture Components MessViewModel
│   │   ├── navigation/     # NavHost and bottom navigation destinations
│   │   ├── screens/        # 11 Compose screens (Home, Admin, Customers, Inventory, Leave, Menu, etc.)
│   │   └── MainActivity.kt # Single Activity Jetpack Compose host
│   └── src/main/res/       # Android strings, XML resources, and theme definitions
│
├── bhojnify-cli/           # Standalone Kotlin console application
│   └── src/main/kotlin/com/bhojnify/cli/
│       └── Main.kt         # Console dashboard showing status, stock ledger, P&L, and i18n verification
│
├── build.gradle.kts        # Root buildscript
├── settings.gradle.kts     # Multi-module inclusions
└── gradle.properties       # JVM & Android build properties
```

---

## 📦 1. Core Domain & State Management (`:bhojnify-core`)

### Key Capabilities:
- **Reactive State Management (`MessStateManager`)**: Exposes an immutable `StateFlow<MessState>`. All mutations (adding customers, taking attendance, logging payments, logging expenses, recording inventory, updating menus, and resolving reminders) trigger thread-safe transformations.
- **Automatic Subscription Extension on Leave Return**: When a customer returns from leave (`completeLeave`), the system calculates the missed days via `DateUtils.daysBetween(leave.from, returnDate)` and automatically extends the customer's subscription `expiryDate`.
- **Bilingual i18n Engine (`I18n.kt`)**: Zero external dependencies, full parameter interpolation (`{name}`, `{count}`, `{days}`, `{field}`), and translation parity across **English (EN)** and **मराठी (MR)**.
- **Financial & Inventory Analytics (`ReportCalculator`)**: Automatically aggregates payments (revenue), expenses (costs), operating margin (P&L), estimated warehouse stock value (`quantity * 100`), and meals served.
- **Local-First JSON Persistence (`JsonFileMessRepository`)**: Uses `kotlinx.serialization` to save and restore complete state from `~/.bhojnify/messmate_state.json` without vendor lock-in.

---

## 🌐 2. Ktor REST API (`:bhojnify-server`)

Provides high-performance asynchronous HTTP microservice endpoints running on port `8080`:

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/health` | `GET` | Service health status & uptime |
| `/api/state` | `GET` | Retrieve complete current state of the mess |
| `/api/customers` | `GET`, `POST` | List and add mess customers |
| `/api/leaves` | `GET`, `POST` | Fetch leave requests and file new leaves |
| `/api/leaves/{id}/complete` | `POST` | Complete leave with return date & auto-extend plan |
| `/api/inventory` | `GET`, `POST` | View stock ledger and update items |
| `/api/menu` | `GET`, `POST` | View and publish daily/weekly menus |
| `/api/expenses` | `GET`, `POST` | Record and list mess operational expenses |
| `/api/payments` | `GET`, `POST` | Track UPI / Cash fees received |
| `/api/reminders` | `GET`, `POST` | View and create task reminders |
| `/api/reminders/{id}/resolve`| `POST` | Mark reminder as resolved/completed |

---

## 📱 3. Jetpack Compose Android UI (`:bhojnify-android`)

Implements a single-activity architecture powered by Jetpack Compose, Material 3, and Kotlin Coroutines:
- **Campus-Kitchen Theme (`BhojnifyTheme`)**: Primary Forest Green (`#1D7A58`), Warm Accent Amber (`#F4C95D`), Off-white Cream background (`#F7F4EC`), and Pure Cream Cards (`#FFFCF5`).
- **11 Dedicated Screens**:
  1. `HomeScreen`: Operating pulse, daily meals breakdown, urgent renewal alerts, pending actions.
  2. `AdminScreen`: Mess control room, low stock alerts, pending leave approvals.
  3. `CustomersScreen`: Filterable member directory (All / Active / Expiring / Expired) with plan renewal dialogs.
  4. `InventoryScreen`: Live stock tracking, minimum threshold indicators, quick reminder generation.
  5. `LeaveScreen`: Leave approval workflow and one-tap return confirmation with automatic plan extension.
  6. `MenuScreen`: Date-grouped menu view, meal slot selector (Breakfast, Lunch, Dinner), meal publishing dialog.
  7. `ExpensesScreen`: Categorized expense ledger with monthly burn-rate calculations.
  8. `PaymentsScreen`: Payment collection logging with Cash / UPI method tags.
  9. `ReportScreen`: Operating margin (P&L), stock valuation card, and attendance health stats.
  10. `StaffScreen`: Kitchen roster, duty assignments, and monthly salary budget tracker.
  11. `FeedbackScreen`: Star ratings, student reviews, and dish-specific culinary feedback.
  12. `ProfileScreen` & `OnboardingScreen`: Rules, policies, language switcher, and contact settings.

---

## 💻 4. Standalone CLI (`:bhojnify-cli`)

A fast console application that can be run on any terminal:
- Displays instant workspace health and active customer counts.
- Evaluates customer plan expiration statuses (Active, Expiring Soon, Expired).
- Audits inventory items against minimum thresholds.
- Computes real-time P&L, stock valuations, and total meals served.
- Demonstrates bilingual i18n interpolation for both English and Marathi.

---

## 🚀 Getting Started & Execution

### Prerequisites
- JDK 17 or later
- Android SDK (optional, only needed for compiling `:bhojnify-android`)

### 1. Run All Unit Tests
```bash
./gradlew test
```
or on Windows:
```cmd
gradlew.bat test
```

### 2. Run the Interactive CLI
```bash
./gradlew :bhojnify-cli:run
```

### 3. Run the Ktor Microservice Server
```bash
./gradlew :bhojnify-server:run
```
Once started, test endpoints via cURL or browser:
```bash
curl http://localhost:8080/health
curl http://localhost:8080/api/state
```

### 4. Build Android Debug APK
```bash
./gradlew :bhojnify-android:assembleDebug
```
The resulting APK will be generated at `bhojnify-android/build/outputs/apk/debug/`.
