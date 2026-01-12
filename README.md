# Payment Gateway System (Stripe-like Architecture)

## Table of Contents

* [Overview](#overview)
* [End-to-End Payment Flow](#end-to-end-payment-flow)
* [What a Real Payment Gateway Has](#what-a-real-payment-gateway-has)
* [Core Architecture](#core-architecture)
* [Payment Lifecycle (State Machine)](#payment-lifecycle-state-machine)
* [Ledger & Accounting Model](#ledger--accounting-model)
* [Event-Driven System Design](#event-driven-system-design)
* [Background Workers](#background-workers)
* [Webhooks System](#webhooks-system)
* [Security & API Design](#security--api-design)
* [Demo Model](#demo-model)
---

## Overview

This project is a **Stripe / Razorpay–style payment gateway system** built to demonstrate **real fintech architecture**, not just payment APIs.

The system focuses on:

* correctness over shortcuts
* ledger-based accounting
* event-driven workflows
* idempotent, retry-safe APIs
* async settlement & payouts

It mirrors how **real payment processors** work internally while remaining demo-friendly.

---

## End-to-End Payment Flow

```
Customer
   ↓
Merchant Website (API Request)
   ↓
Merchant Backend
   ↓
Payment Gateway API
   ↓
Network (Authorization)
   ↓
Payment Gateway
   ├─ Capture
   ├─ Settlement
   └─ Payout
   ↓
Merchant Bank Account
```

**Important:**
Authorization, capture, settlement, and payout are **separate steps**, not one action.

---

## What a Real Payment Gateway Has

These components exist inside Stripe, Razorpay, PayPal, Adyen.

### A. Payment Flow Components

1. **Payment Intent / Charge Object**
   Tracks lifecycle:
   `created → authorized → captured → settled → payout → request for refund → refunded`

2. **Authorization**
   Bank confirms funds (no money moves)

3. **Capture**
   Money moves into processor escrow

4. **Settlement**
   Funds cleared into merchant balance

5. **Payouts**
   Merchant receives funds after T+1 / T+2

6. **Refunds & Disputes**
   Partial / full refunds with ledger reversal

---

### B. Ledger & Accounting (Critical)

* Double-entry ledger system
* Internal merchant balances (escrow)
* Platform fee accounting
* Reconciliation between events, ledger, and balances

---

### C. Security & Validation

* Idempotency keys
* Fraud rules (velocity, IP, retries)
* Webhook signature verification
* Rate limiting & abuse protection

---

### D. API Gateway Features

* API key authentication
* API versioning
* Request validation
* Predictable error models (Stripe-like)

---

### E. Merchant Dashboard

* Charges list
* Payment timeline
* Ledger entries
* Refunds & payouts
* Webhook logs

---

### F. Background Workers

* Settlement worker
* Payout worker
* Refund worker
* Webhook dispatcher
* Reconciliation worker

Everything important is **asynchronous**.

---

## Core Architecture

```
Merchant API Request
        ↓
API Gateway (Auth + Rate Limit + Idempotency)
        ↓
Payment Orchestrator
        ↓
State Machine
        ↓
Event Store (Source of Truth)
        ↓
Ledger (Financial Truth)
        ↓
Queues
        ↓
Background Workers
        ↓
Projections + Webhooks + Dashboard
```

---

## Payment Lifecycle (State Machine)

The gateway enforces **strict state transitions**.

```
created
→ authorized
→ capture_pending
→ captured
→ settlement_pending
→ settled
→ payout_pending
→ payout_completed
→ refunded (optional)
→ disputed (optional)
```

### Why this matters

* Prevents illegal transitions
* Makes retries safe
* Enables event replay
* Simplifies debugging

---

## Ledger & Accounting Model

### Double-Entry Accounting Example

For a ₹1000 payment with ₹30 platform fee:

| Account         | Debit | Credit |
| --------------- | ----- | ------ |
| Customer        | 1000  | 0      |
| Merchant Escrow | 0     | 970    |
| Platform Fees   | 0     | 30     |

**Rules enforced:**

* Debits == Credits
* Append-only entries
* Atomic DB transactions
* No silent balance mutation

This proves **financial correctness**.

---

## Event-Driven System Design

### Event Sourcing

Every action emits an immutable event:

* `payment_created`
* `payment_authorized`
* `payment_captured`
* `settlement_completed`
* `payout_created`
* `refund_issued`

The **event store is the source of truth**.

If projections fail → rebuild from events.

---

### CQRS (Command Query Responsibility Segregation)

* **Writes** → Commands → Events
* **Reads** → Projections

Projections power:

* dashboards
* APIs
* analytics

---

## Background Workers

### 1. Settlement Worker

Triggered by `payment_captured`

* Groups payments
* Applies fees
* Marks payments as settled
* Writes ledger entries

---

### 2. Payout Worker

Triggered by `settled`

* Schedules payouts (T+1 / T+2)
* Moves escrow → merchant bank
* Emits payout events

---

### 3. Webhook Worker

* Signs payload (HMAC)
* Sends POST requests
* Retries with exponential backoff
* Logs delivery attempts

---

### 4. Reconciliation Worker

Periodically validates:

* ledger totals
* event totals
* projections
* negative balances

This is how **money systems stay correct**.

---

## Webhooks System

### Events Sent

* `charge.captured`
* `refund.issued`
* `payout.completed`

### Guarantees

* Signed payloads
* Retry with backoff
* Delivery logs
* Eventual consistency

---

## Security & API Design

* API key–based merchant identity
* Per-merchant rate limiting
* Idempotent POST requests
* HMAC-signed webhooks
* Tokenization (no raw card storage)
* HTTPS enforced
* Predictable error codes

---

## Demo Model

### Demo-Friendly Merchant Flow

* Each visitor becomes a **test merchant**
* A demo API key is auto-generated
* No signup required
* All data isolated per merchant



