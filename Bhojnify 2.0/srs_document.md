# Software Requirements Specification (SRS)
## Bhojnify (MessMate) — Campus-Kitchen & Mess Management Platform

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) establishes the complete functional, non-functional, data, and architectural requirements for the **Bhojnify** (formerly MessMate) system. It serves as the definitive technical reference for developers, quality assurance engineers, and system architects maintaining the dual **TypeScript (React Native / Expo)** and **Idiomatic Kotlin (Ktor / Jetpack Compose / CLI)** codebases.

### 1.2 Scope of the Product
Bhojnify is a local-first, offline-resilient operations and financial administration platform designed for campus dining halls, student hostels, and independent mess operators. The system delivers:
- Local-first state management and atomic file persistence.
- Zero-dependency bilingual internationalization (English & Marathi).
- Real-time customer subscription management with auto-expiry calculation.
- Leave tracking with automatic subscription extension upon return.
- Raw material stock ledgers with threshold alerting and scheduled reminders.
- Dynamic menu planning across meal slots (Breakfast, Lunch, Dinner).
- Complete financial ledger tracking UPI/Cash revenues, operational expenses, and monthly P&L operating margins.
- Staff wage budgeting and customer culinary feedback tracking.
- Asynchronous Ktor 3.x REST API endpoints and native Jetpack Compose UI.

### 1.3 Definitions, Acronyms, and Abbreviations
- **P&L**: Profit and Loss (Operating Margin = Total Revenue - Total Operational Expenses).
- **i18n**: Internationalization (Bilingual support for English `en` and Marathi `mr`).
- **StateFlow**: Kotlin Coroutines reactive data holder representing immutable state sequences.
- **AsyncStorage**: Local key-value asynchronous storage system on mobile/web clients.
- **REST**: Representational State Transfer.
- **Ktor**: Asynchronous framework for creating connected systems in Kotlin using Netty.

---

## 2. Overall Description

### 2.1 Product Perspective & System Architecture
Bhojnify operates as a distributed, decoupled, local-first system available across two primary runtimes:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                            BHOJNIFY CORE RUNTIMES                            │
├──────────────────────────────────────┬───────────────────────────────────────┤
│    A. TypeScript / Expo Workspace    │     B. Kotlin Multi-Module Platform   │
├──────────────────────────────────────┼───────────────────────────────────────┤
│ • React Native 0.81 (Expo Router v6) │ • :bhojnify-core (Domain & StateFlow) │
│ • AsyncStorage local persistence     │ • :bhojnify-server (Ktor 3.x Netty)   │
│ • Web & Mobile unified rendering     │ • :bhojnify-android (Jetpack Compose) │
│ • Tailwind / Custom Token theme      │ • :bhojnify-cli (Terminal runner)     │
└──────────────────────────────────────┴───────────────────────────────────────┘
```

### 2.2 User Characteristics
- **Mess Owner / Administrator**: Primary operator with full administrative permissions to create customer records, record cash/UPI payments, log expenses, manage stock, publish menus, and resolve reminders.
- **Kitchen Staff / Cooks**: View-only or localized terminal access to daily headcounts, meal slots, and low-stock warnings in Marathi.
- **Student Subscriber**: Beneficiary of transparent validity dates and automatic plan extensions for approved leaves.

### 2.3 Operating Environment
- **Web**: Modern HTML5 browsers (Chrome 120+, Safari 17+, Firefox 120+, Edge).
- **Android**: Android 8.0 (API level 26) and above running Jetpack Compose.
- **JVM Server / CLI**: JDK 17+ or OpenJDK running Netty microservice engine.
- **Storage Layer**: Local JSON file storage (`~/.bhojnify/messmate_state.json`) and device `AsyncStorage`.

---

## 3. Detailed Data Models & State Contracts

The core state is structured around the unified `MessState` schema:

```kotlin
data class MessState(
    val profile: OwnerProfile = OwnerProfile(),
    val policies: OwnerPolicies = OwnerPolicies(),
    val language: Language = Language.EN,
    val customers: List<Customer> = emptyList(),
    val attendance: List<AttendanceRecord> = emptyList(),
    val leaves: List<LeaveRequest> = emptyList(),
    val inventory: List<InventoryItem> = emptyList(),
    val reminders: List<Reminder> = emptyList(),
    val menus: List<MenuItem> = emptyList(),
    val expenses: List<Expense> = emptyList(),
    val payments: List<Payment> = emptyList(),
    val staff: List<StaffMember> = emptyList(),
    val feedback: List<Feedback> = emptyList()
)
```

### 3.1 Entity Specifications
1. **`Customer`**:
   - `id`: String (UUID)
   - `name`: String
   - `phone`: String
   - `plan`: String (e.g., "Monthly Veg", "Standard 2-Time")
   - `joiningDate`: String (ISO-8601: `YYYY-MM-DD`)
   - `expiryDate`: String (ISO-8601: `YYYY-MM-DD`)
   - `paymentStatus`: Enum (`PAID`, `DUE`, `PENDING`)
   - `avatar`: Optional String

2. **`LeaveRequest`**:
   - `id`: String (UUID)
   - `customerId`: Optional String (Foreign key to `Customer.id`)
   - `from`: String (ISO-8601: `YYYY-MM-DD`)
   - `to`: Optional String (ISO-8601: `YYYY-MM-DD`, null when ongoing)
   - `reason`: String
   - `status`: Enum (`PENDING`, `APPROVED`, `REJECTED`)
   - `appliedAt`: String (ISO-8601)

3. **`InventoryItem`**:
   - `id`: String (UUID)
   - `name`: String (e.g., "Rice (Kolam)", "Toor Dal", "Sunflower Oil")
   - `quantity`: Double
   - `unit`: String (`kg`, `L`, `bags`, `cylinders`, `pcs`)
   - `minimum`: Double (Safety threshold)
   - `lastUpdated`: String

4. **`MenuItem`**:
   - `id`: String (UUID)
   - `meal`: Enum (`BREAKFAST`, `LUNCH`, `DINNER`)
   - `date`: String (ISO-8601: `YYYY-MM-DD`)
   - `items`: List of Strings (Dish names)
   - `special`: Boolean
   - `note`: Optional String

5. **`Expense`**:
   - `id`: String (UUID)
   - `category`: String ("Groceries", "Vegetables", "Gas", "Staff", "Rent", "Other")
   - `amount`: Double (INR ₹)
   - `date`: String (ISO-8601: `YYYY-MM-DD`)
   - `note`: String

6. **`Payment`**:
   - `id`: String (UUID)
   - `customerId`: Optional String
   - `amount`: Double (INR ₹)
   - `method`: String ("UPI", "Cash", "Card")
   - `date`: String (ISO-8601: `YYYY-MM-DD`)
   - `note`: String

7. **`Reminder`**:
   - `id`: String (UUID)
   - `title`: String
   - `daysDue`: Int (Day offset)
   - `note`: String
   - `resolved`: Boolean

8. **`StaffMember`**:
   - `id`: String (UUID)
   - `name`: String
   - `role`: String ("Head Chef", "Assistant Cook", "Server", "Helper")
   - `phone`: String
   - `salary`: Double (Monthly INR ₹)

---

## 4. Specific Functional Requirements

### 4.1 Onboarding & Profile Configuration
- **REQ-1.1 (Setup Gate)**: The system shall display an onboarding wizard on first launch if the owner profile is unconfigured (`messName.isEmpty()`).
- **REQ-1.2 (Bilingual Selection)**: The user shall be able to toggle the application language between English (`EN`) and Marathi (`MR`) at any time, instantly updating all text, dates, and currency labels.
- **REQ-1.3 (Policy Generator)**: The system shall allow owners to configure operating rules (meal timings, leave cutoffs, guest rates) and provide a one-tap formatted string copy to the clipboard for WhatsApp sharing.

### 4.2 Customer & Subscription Management
- **REQ-2.1 (Customer Registration)**: The system shall record customer details with automatic 30-day default expiry date calculation from `joiningDate`.
- **REQ-2.2 (Real-Time Expiry Countdown)**: The system shall dynamically compute days remaining for every customer:
  $$\text{DaysLeft} = \text{daysBetween}(\text{Today}, \text{customer.expiryDate})$$
  - Categorizing into: **Active** ($\text{DaysLeft} > 3$), **Expiring Soon** ($0 \le \text{DaysLeft} \le 3$), and **Expired** ($\text{DaysLeft} < 0$).
- **REQ-2.3 (Plan Renewal)**: The system shall support a one-tap subscription renewal extending the expiration date by 30 calendar days and creating a corresponding payment entry.

### 4.3 Intelligent Leave Return & Auto-Extension Engine
- **REQ-3.1 (Leave Submission)**: The system shall allow logging leaves with start date, optional return date, and reason.
- **REQ-3.2 (Return Completion & Date Math)**: When an owner marks a leave as completed with a given return date:
  1. The system shall compute missed days:
     $$\Delta\text{Missed} = \max(0, \text{daysBetween}(\text{leave.from}, \text{returnDate}))$$
  2. The leave record `status` shall be updated to `APPROVED` and `to` set to `returnDate`.
  3. If $\Delta\text{Missed} > 0$, the corresponding customer's `expiryDate` shall be updated:
     $$\text{customer.expiryDate} \leftarrow \text{addDays}(\text{customer.expiryDate}, \Delta\text{Missed})$$
- **REQ-3.3 (Audit Notice)**: The system shall emit an explanatory notification confirming the exact number of days added to the student's plan.

### 4.4 Inventory Control & Low-Stock Guardian
- **REQ-4.1 (Stock Auditing)**: The system shall track item quantities and flag any item where $\text{quantity} \le \text{minimum}$ with a visual `⚠️ LOW STOCK` warning badge.
- **REQ-4.2 (Reminder Generation)**: The owner shall be able to schedule a restock reminder directly from a low-stock inventory item with a single tap.

### 4.5 Task & Operational Reminders
- **REQ-5.1 (Reminder Queue)**: The system shall display pending tasks sorted by due date.
- **REQ-5.2 (Resolve Action)**: The system shall allow marking reminders as resolved, removing them from active view widgets.

### 4.6 Menu Planning & Slot Organization
- **REQ-6.1 (Slot Partitioning)**: The system shall categorize meals into Breakfast (नाश्ता), Lunch (दुपारचे जेवण), and Dinner (रात्रीचे जेवण).
- **REQ-6.2 (Menu Publisher)**: Admins shall be able to record dishes for specific dates and publish special weekend/holiday meal announcements.

### 4.7 Financial P&L & Analytics (`ReportCalculator`)
- **REQ-7.1 (Revenue Aggregation)**: The system shall compute total revenue as the sum of all recorded payments:
  $$\text{Revenue} = \sum_{p \in \text{Payments}} p.\text{amount}$$
- **REQ-7.2 (Cost Aggregation)**: The system shall compute total operational expenses as the sum of all recorded expenses:
  $$\text{Costs} = \sum_{e \in \text{Expenses}} e.\text{amount}$$
- **REQ-7.3 (Net Operating Margin)**: The system shall compute:
  $$\text{Operating Margin} = \text{Revenue} - \text{Costs}$$
  Labeling the status as **Profit / Surplus** ($\ge 0$) or **Deficit** ($< 0$).
- **REQ-7.4 (Stock Valuation)**: The system shall estimate total warehouse inventory value:
  $$\text{Stock Valuation} = \sum_{i \in \text{Inventory}} i.\text{quantity} \times 100.0$$

### 4.8 Staff Roster & Payroll
- **REQ-8.1 (Staff Ledger)**: The system shall record kitchen employees with roles and monthly salaries.
- **REQ-8.2 (Payroll Budget)**: The system shall aggregate monthly payroll commitments across all active staff members.

### 4.9 Bilingual Translation Engine (`I18n`)
- **REQ-9.1 (Zero External Dependencies)**: The translation engine must operate with zero third-party dependencies using dictionary lookups.
- **REQ-9.2 (Variable Substitution)**: The translator shall support dynamic placeholders:
  - `{name}`, `{count}`, `{days}`, `{field}`, `{plural}`
- **REQ-9.3 (Domain Localization)**: Full vocabulary localization for meal categories, payment statuses, and date labels.

---

## 5. REST API Specifications (Ktor Microservice `:bhojnify-server`)

The Ktor server operates on port `8080` with standard JSON serialization:

| Endpoint | Method | Request Payload | Response | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/health` | `GET` | None | `{"status":"ok","uptime":...}` | System health check |
| `/api/state` | `GET` | None | Full `MessState` JSON | Complete mess state dump |
| `/api/customers` | `GET` | None | `List<Customer>` | List all customers |
| `/api/customers` | `POST` | `Customer` JSON | `{"status":"success"}` | Create customer |
| `/api/leaves` | `GET` | None | `List<LeaveRequest>` | List leave applications |
| `/api/leaves` | `POST` | `LeaveRequest` JSON | `{"status":"success"}` | Create leave request |
| `/api/leaves/{id}/complete` | `POST` | `{"returnDate":"YYYY-MM-DD"}` | `{"status":"success"}` | Complete leave & auto-extend plan |
| `/api/inventory` | `GET` | None | `List<InventoryItem>` | Get stock ledger |
| `/api/inventory` | `POST` | `InventoryItem` JSON | `{"status":"success"}` | Update stock item |
| `/api/menu` | `GET` | None | `List<MenuItem>` | Get menu calendar |
| `/api/menu` | `POST` | `MenuItem` JSON | `{"status":"success"}` | Publish menu item |
| `/api/expenses` | `GET` | None | `List<Expense>` | Get expense records |
| `/api/expenses` | `POST` | `Expense` JSON | `{"status":"success"}` | Log operational expense |
| `/api/payments` | `GET` | None | `List<Payment>` | Get payment records |
| `/api/payments` | `POST` | `Payment` JSON | `{"status":"success"}` | Record fee payment |
| `/api/reminders` | `GET` | None | `List<Reminder>` | List tasks/reminders |
| `/api/reminders/{id}/resolve` | `POST` | None | `{"status":"success"}` | Mark task as resolved |

---

## 6. Non-Functional Requirements (NFR)

### 6.1 Performance
- **Local Read/Write**: State modifications and persistence operations must complete in $< 15\text{ ms}$.
- **Date Math & Report Generation**: Financial and calendar calculations must execute in $< 5\text{ ms}$ for datasets up to 10,000 entities.

### 6.2 Reliability & Fault Tolerance
- **Atomic File Writing**: The Kotlin `JsonFileMessRepository` and Expo `AsyncStorage` implementations must perform atomic persistence to prevent corruption during system crashes.
- **Offline Self-Sufficiency**: The entire client and CLI interface must function without internet access.

### 6.3 Usability & Human Factors
- **Visual Design**: Complies with the Bhojnify design language:
  - Primary Green: `#1D7A58`
  - Accent Yellow: `#F4C95D`
  - Cream Background: `#F7F4EC`
  - Pure Card Surface: `#FFFCF5`
- **Accessible Contrast**: All text satisfies WCAG 2.1 AA contrast requirements across both English and Marathi scripts.

### 6.4 Security & Data Privacy
- **Local Sovereignty**: All customer PII (phone numbers, fees, leaves) remains securely stored in the owner's local environment.
- **Input Validation**: All monetary amounts, dates, and phone numbers are validated prior to state mutation.

---

## 7. Verification & Acceptance Criteria

1. **Leave Extension Verification**:
   - Submitting a leave starting `2026-09-10` and completing with return date `2026-09-15` (5 days missed) on a customer expiring `2026-10-01` must shift customer `expiryDate` to exactly `2026-10-06`.
2. **Financial Aggregation Verification**:
   - Payments totalling ₹5,500 and Expenses totalling ₹2,500 must produce Operating Margin = ₹3,000 (Profit).
3. **i18n Translation Parity**:
   - Every key in `Language.EN` dictionary must have an exact localized equivalent in `Language.MR`.
