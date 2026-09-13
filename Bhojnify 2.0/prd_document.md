# Product Requirements Document (PRD)
## Bhojnify (MessMate) — Campus-Kitchen & Mess Management Platform

---

## 1. Executive Summary & Document Overview

### 1.1 Product Vision
**Bhojnify** (formerly MessMate) is an all-in-one, local-first operations and financial management platform purpose-built for campus kitchen operators, independent mess owners, and hostel dining administrators. Bhojnify replaces fragile paper notebooks, fragmented WhatsApp spreadsheets, and manual token-based tracking with an intuitive, bilingual, and offline-resilient digital control room.

### 1.2 Core Value Propositions
1. **Prevent Revenue Leakage**: Automatically audit customer subscriptions, calculate day-accurate plan expirations, and log fee payments with UPI/Cash breakdown.
2. **Fair Leave & Subscription Extension**: Eliminate disputes over missed meals with an intelligent leave-return engine that automatically shifts customer subscription expiry dates forward by the exact duration of approved leaves.
3. **Operational Clarity & P&L Oversight**: Provide real-time visibility into daily meal counts, inventory thresholds, categorized kitchen overheads, and monthly operating profit margins.
4. **Zero-Friction Bilingual Usability**: Fully localized interface in English and **मराठी (Marathi)** with dynamic variable interpolation to empower grassroots kitchen staff and mess proprietors.
5. **Local-First & Multi-Platform Architecture**: Seamless offline-first operation on web and mobile with full cross-compilation and parity in both **TypeScript (React Native / Expo Router)** and **Idiomatic Kotlin (Ktor / Jetpack Compose / CLI)**.

---

## 2. User Personas & Target Audience

### 2.1 Primary Persona: Mess Owner / Kitchen Operator ("Ketan Patil")
- **Role**: Proprietor / Manager of a 50–300 seat campus dining hall.
- **Pain Points**:
  - Daily disputes with students regarding leave credits and subscription end dates.
  - Unexpected ingredient shortages during peak lunch/dinner rush.
  - Difficulty tracking miscellaneous cash expenditures (gas cylinders, vegetables, spices).
  - Language barrier with complex English-only ERP systems.
- **Key Goals**: Manage daily attendance, track expiring customer plans, approve leaves with automatic validity extensions, audit low stock, and view real-time monthly profit margins.

### 2.2 Secondary Persona: Kitchen Helper / Cook ("Ramesh Chef")
- **Role**: Head Cook / Kitchen Staff Member.
- **Needs**: View the daily published menu and meal slot requirements (Breakfast, Lunch, Dinner) in Marathi; easily alert the owner when essential supplies (oil, dal, rice) drop below safety minimums.

### 2.3 End Beneficiary: Student / Hosteller ("Aarav Deshmukh")
- **Role**: Regular mess subscriber on Monthly Veg / Special / Non-Veg plans.
- **Benefits**: Fair credit for approved leaves without manual haggling; transparent billing policies, clear menu visibility, and an open feedback channel.

---

## 3. Implemented Product Capabilities & System Specifications

The system is fully developed and operational across web, mobile, and backend microservices. The capabilities are structured into nine functional pillars:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       BHOJNIFY PLATFORM CAPABILITIES                         │
├───────────────────┬───────────────────┬──────────────────┬──────────────────┤
│ 1. Onboarding &   │ 2. Customers &    │ 3. Leave Return  │ 4. Inventory &   │
│    Profile Setup  │    Subscriptions  │    Auto-Extend   │    Stock Alerts  │
├───────────────────┼───────────────────┼──────────────────┼──────────────────┤
│ 5. Menu Publisher │ 6. P&L Financial  │ 7. Staff & Wages │ 8. Feedback &    │
│    & Slots        │    Ledger         │    Management    │    Satisfaction  │
├───────────────────┴───────────────────┴──────────────────┴──────────────────┤
│ 9. Zero-Dependency Bilingual i18n Engine (English & Marathi)                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.1 Owner Onboarding & Workspace Initialization
- **First-Launch Wizard**: Non-blocking local setup collecting:
  - Owner Full Name
  - Mess / Dining Hall Name (e.g., "Shivneri Mess")
  - Address / Campus Location
  - Primary Contact Phone Number
  - Preferred Interface Language (`en` or `mr`)
- **Policy & Rules Configuration**: Built-in template generator for meal timings, leave cut-off hours, refund/rebate rules, and hygiene protocols with one-tap clipboard copying for WhatsApp broadcast.

### 3.2 Customer Subscription & Auto-Expiry Lifecycle
- **Customer Profiles**: Name, contact phone, join date, current expiration date, active meal plan (e.g., *Monthly Veg*, *Standard Two-Time*, *Special Unlimited*), and payment status (`PAID`, `DUE`, `PENDING`).
- **Dynamic Expiry Countdown Engine**: Real-time calendar math comparing current date with `expiryDate`:
  - `[ACTIVE - Xd left]`: Plan healthy with >3 days remaining.
  - `[EXPIRING SOON - Xd left]`: Plan expiring within 0 to 3 days (highlighted in warm accent).
  - `[EXPIRED - Xd ago]`: Plan lapsed (urgent red tag).
- **One-Tap Plan Renewal**: Seamless renewal action adding +30 calendar days to the active expiration date and recording corresponding payment logs.
- **Filter Tabs**: Instant directory sorting across `All`, `Active`, `Expiring`, and `Expired`.

### 3.3 Leave Management & Automatic Subscription Extension
- **Leave Lifecycle**: Students file or owners log leaves with start date (`from`), optional expected return date (`to`), and reason (e.g., *Going home for exams*). Status: `PENDING`, `APPROVED`, `REJECTED`.
- **Intelligent Auto-Extend Algorithm**:
  - When the customer returns, the owner completes the leave by recording the actual return date.
  - The system computes exact calendar days missed:
    $$\Delta\text{Days} = \max(0, \text{daysBetween}(\text{leave.from}, \text{returnDate}))$$
  - The customer's subscription expiration is automatically shifted forward:
    $$\text{newExpiryDate} = \text{addDays}(\text{customer.expiryDate}, \Delta\text{Days})$$
  - Produces an instant bilingual confirmation notice explaining the automatic extension.

### 3.4 Inventory Ledger & Low-Stock Guardian
- **Stock Tracking**: Maintains digital ledger of commodities (Rice, Toor Dal, Sunflower Oil, Wheat Flour, LPG Cylinders, Spices) with current quantity, metric units (`kg`, `L`, `bags`, `cylinders`, `pcs`), and safety minimum threshold.
- **Automated Threshold Warnings**: Triggers `⚠️ LOW STOCK` badges when `quantity <= minimum`.
- **One-Tap Task Reminders**: Direct conversion of low-stock alerts into scheduled owner follow-up reminders with custom due dates.

### 3.5 Operational Reminders & Task Tracker
- **Task Management**: Title, due date offset (days), note, and resolution status.
- **Actionable Resolve Action**: Clear one-tap resolution removing finished tasks from active dashboard widgets.

### 3.6 Menu Planning & Meal Slot Publishing
- **Slot Partitioning**: Supports Breakfast (नाश्ता), Lunch (दुपारचे जेवण), and Dinner (रात्रीचे जेवण).
- **Calendar Menu Scheduler**: Assigns dishes, special festival items, and nutritional/dietary tags to specific dates.
- **Publishing & Sharing**: Quick formatting for kitchen board display and student message broadcasts.

### 3.7 Financial Ledger & Real-Time P&L Reporting
- **Revenue Ingestion**: Tracks all student fee collections with payment methods (`UPI`, `Cash`, `Card`), transaction timestamps, and notes.
- **Operational Expense Logging**: Categorized operational cost tracking:
  - `Groceries` (Dhanya & Spices)
  - `Vegetables & Dairy` (Bhaji-Pala, Milk)
  - `Gas & Fuel` (LPG Cylinders)
  - `Staff Salaries` (Cook & Helper wages)
  - `Rent & Maintenance` (Electricity, Water, Cleaning)
  - `Miscellaneous`
- **Analytical Metrics (`ReportCalculator`)**:
  - **Total Gross Revenue**: $\sum \text{Payments}$
  - **Total Operating Costs**: $\sum \text{Expenses}$
  - **Net Operating Margin (P&L)**: $\text{Revenue} - \text{Costs}$ (Indicates monthly Surplus/Profit or Deficit)
  - **Warehouse Stock Valuation**: Estimated inventory worth ($\sum \text{item.quantity} \times \text{unitValuation}$)
  - **Total Meals Served Headcount**: Aggregated meal servings calculation.

### 3.8 Staff Roster & Monthly Payroll
- **Staff Profiles**: Name, kitchen role (*Head Chef*, *Assistant Cook*, *Server*, *Dishwasher*), contact phone, joining date, and fixed monthly salary.
- **Payroll Budgeting**: Live aggregation of total monthly kitchen wage commitments.

### 3.9 Customer Culinary Feedback Ledger
- **Rating & Sentiment**: 5-star ratings, meal category tags, dish-specific remarks, and feedback date logging for quality control.

### 3.10 Zero-Dependency Bilingual i18n Engine
- **Supported Languages**: English (`en`) and Marathi (`mr`).
- **Dynamic Interpolation**: Zero-dependency string formatter supporting variable tokens like `{name}`, `{count}`, `{days}`, `{field}`, and `{plural}`.
- **Domain Localization**: Comprehensive translations for meal names, error states, navigational headers, confirmation alerts, and financial terms.

---

## 4. Multi-Platform Technical Architecture

The Bhojnify platform is architected with dual production implementations ensuring maximum portability and zero vendor lock-in:

```
                                  ┌────────────────────────┐
                                  │   Bhojnify Workspace   │
                                  └───────────┬────────────┘
                                              │
                    ┌─────────────────────────┴─────────────────────────┐
                    ▼                                                   ▼
       ┌────────────────────────┐                          ┌────────────────────────┐
       │ TypeScript / Expo Tree │                          │  Multi-Module Kotlin   │
       └────────────┬───────────┘                          └───────────┬────────────┘
                    │                                                  │
       ┌────────────┴────────────┐                        ┌────────────┴────────────┐
       ▼                         ▼                        ▼            ▼            ▼
 ┌───────────┐             ┌───────────┐            ┌───────────┐┌───────────┐┌───────────┐
 │React Native│            │Express API│            │bhojnify-  ││bhojnify-  ││bhojnify-  │
 │Expo Web/App│            │Postgres/  │            │core       ││server     ││android    │
 │Local-First │            │Drizzle    │            │(StateFlow)││(Ktor 3.x) ││(Compose)  │
 └───────────┘             └───────────┘            └───────────┘└───────────┘└───────────┘
```

### 4.1 TypeScript & React Native Architecture
- **Framework**: React Native 0.81 + Expo SDK 54 + Expo Router v6 (File-based navigation).
- **Styling**: Tailored Design Tokens with warm campus palette (Forest Green `#1D7A58`, Amber `#F4C95D`, Card Cream `#FFFCF5`).
- **State & Storage**: Local-first immutable state with `AsyncStorage` persistence and React Query cache.

### 4.2 Kotlin Multi-Module Ecosystem (`/kotlin`)
- **`:bhojnify-core`**:
  - Pure Kotlin JVM/Android domain library.
  - Reactive state management via coroutine-based `StateFlow<MessState>` and `MessStateManager`.
  - Immutable business actions for leaves, customers, expenses, payments, and reminders.
  - Local-first JSON file persistence (`JsonFileMessRepository`) with `kotlinx.serialization`.
  - Leap-year-safe calendar calculations using Java 8+ `java.time.LocalDate`.
- **`:bhojnify-server`**:
  - Asynchronous Netty-based Ktor 3.x REST API microservice.
  - Endpoints: `/health`, `/api/state`, `/api/customers`, `/api/leaves`, `/api/inventory`, `/api/menu`, `/api/expenses`, `/api/payments`, `/api/reminders`.
- **`:bhojnify-android`**:
  - Native Android application built with 100% Jetpack Compose and Material 3.
  - 11 custom Compose screens with single-activity navigation (`AppNavigator`).
- **`:bhojnify-cli`**:
  - Console CLI application outputting formatted tables of active memberships, stock levels, and P&L statements.

---

## 5. Non-Functional & Operational Requirements

1. **Offline Availability**: 100% of core owner workflows (adding customers, taking attendance, updating stock, calculating leaves) must operate seamlessly without internet connectivity.
2. **Data Privacy & Local Sovereignty**: All mess data resides on the owner's device/local filesystem by default with zero unauthorized external sync.
3. **Performance**: All calculation operations (P&L totals, stock threshold evaluations, date extensions) must execute in $<10\text{ ms}$.
4. **Resilience**: JSON storage writes use atomic persistence to prevent corruption during unexpected shutdowns.

---

## 6. Release & Verification Matrix

| Module | Test / Verification Method | Status |
| :--- | :--- | :--- |
| **Bilingual i18n** | `I18nTest.kt` (Variable interpolation in EN and MR) | ✅ Complete & Verified |
| **Date & Auto-Extend Math** | `DateUtilsTest.kt` (Leap year and negative ranges) | ✅ Complete & Verified |
| **Financial Calculations** | `ReportCalculatorTest.kt` (Margin, stock value, meals) | ✅ Complete & Verified |
| **State Mutations** | `MessStateManagerTest.kt` (Leave completion, reminders) | ✅ Complete & Verified |
| **Expo Web & Mobile UI** | Local Metro dev server on port `8081` | ✅ Complete & Live |
| **Ktor Microservice** | RESTful endpoint verification on port `8080` | ✅ Complete & Ready |
| **Android Compose UI** | Gradle debug compilation (`:bhojnify-android`) | ✅ Complete & Ready |
