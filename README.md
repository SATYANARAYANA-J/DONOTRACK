

<!-- SCREENSHOT 1 — Donor dashboard -->

<p align="center">
  <img src="WhatsApp Image 2026-08-01 at 5.28.49 PM.jpeg" alt="DonoTrack Donor Dashboard" width="900">
</p>

---
# DonoTrack 🛡️

> **Decentralized Donation Tracking Platform for Transparent and Verifiable Fund Usage**

DonoTrack is a blockchain-based donation tracking platform built on **Cardano** that enables donors and NGOs to track donations, verify fund movement, and attach verifiable spending proofs to on-chain records.

The platform combines **backend APIs, relational data management, Cardano blockchain integration, and IPFS-based proof storage** to create a more transparent donation workflow.

**Built for:** Cardano Hackathon Asia 2025

---

## Overview

Traditional donation platforms often rely heavily on centralized systems to report how donated funds are used.

DonoTrack explores a decentralized approach where:

```text
Donation
   │
   ▼
Backend API
   │
   ├──────────────► PostgreSQL
   │
   ▼
Cardano Blockchain
   │
   ▼
On-chain Transaction
   │
   ▼
Donation Record
   │
   ▼
IPFS Proof
   │
   ▼
Verifiable Spending Evidence
```

The system provides separate workflows for donors and NGOs while maintaining a traceable relationship between donations, transactions, campaigns, and spending proofs.

---

## Problem

Donation ecosystems can suffer from limited transparency after funds are transferred.

Common problems include:

* Limited visibility into fund movement
* Centralized records
* Difficulty verifying spending claims
* Lack of accessible proof of expenditure
* Reduced donor confidence
* Fragmented campaign and donation tracking

The core problem is not simply **making a donation**.

It is establishing:

> **Where did the money go, and can the reported usage be independently verified?**

---

## Solution

DonoTrack combines traditional backend infrastructure with decentralized technologies.

### Donation Tracking

Donation-related records are associated with Cardano blockchain transactions, providing an immutable transaction reference.

### Spending Proof

NGOs can upload supporting evidence such as:

* Receipts
* Images
* Documents

The files are stored using **IPFS**, while their references can be associated with the relevant donation or spending record.

### Transparency Dashboard


Donors can monitor campaign and donation information through dashboards designed around:

* Donation history
* Campaign activity
* Fund usage
* Transaction information
* Spending evidence

---

## Key Features

### 1. Transparent Donations

Donation transactions can be tracked through Cardano blockchain records.

Each transaction provides a verifiable reference instead of relying entirely on an internal centralized record.

---

### 2. Donation Tracking

Donors can monitor their donation activity and associated campaign information.



### 3. NGO Campaign Management

NGOs can manage campaigns and monitor donation activity through their dashboard.

<!-- SCREENSHOT 2 — NGO dashboard -->



### 4. IPFS Spending Proofs

NGOs can upload evidence supporting fund usage.

Examples include:

* Receipts
* Photos
* Supporting documents

Proof files are stored using IPFS and associated with the corresponding records.


### 5. Cardano Blockchain Integration

DonoTrack integrates with the Cardano ecosystem to provide blockchain-backed transaction references.

The backend communicates with blockchain infrastructure through the Blockfrost API.



### 6. Analytics & Dashboards

Dashboards provide users with an overview of:

* Campaign activity
* Donations
* Fund movement
* Impact information

---

## Architecture

DonoTrack follows a layered full-stack architecture combining centralized application services with decentralized infrastructure.

```text
                         ┌──────────────────────┐
                         │        Users         │
                         │  Donors / NGOs       │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │    React Frontend    │
                         │                      │
                         │ React + Vite         │
                         │ Tailwind CSS         │
                         │ Framer Motion        │
                         └──────────┬───────────┘
                                    │
                               HTTP / REST
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │     FastAPI Backend  │
                         │                      │
                         │ API Routes           │
                         │ Business Logic       │
                         │ Validation            │
                         │ Authentication        │
                         └──────┬─────────┬─────┘
                                │         │
                    ┌───────────┘         └─────────────┐
                    ▼                                   ▼
          ┌──────────────────┐                 ┌──────────────────┐
          │   PostgreSQL     │                 │    Blockfrost    │
          │                  │                 │                  │
          │ Application Data │                 │ Cardano Network  │
          └──────────────────┘                 └────────┬─────────┘
                                                        │
                                                        ▼
                                               ┌──────────────────┐
                                               │     Cardano      │
                                               │    Blockchain    │
                                               └──────────────────┘

                    ┌──────────────────────────────┐
                    │        Pinata / IPFS         │
                    │                              │
                    │ Receipts / Images / Proofs  │
                    └──────────────────────────────┘
```



## Donation & Verification Flow

The core workflow can be represented as:

```text
Donor
  │
  ▼
Select Campaign
  │
  ▼
Create Donation
  │
  ▼
Cardano Transaction
  │
  ▼
Blockchain Confirmation
  │
  ▼
Backend Records Transaction
  │
  ▼
Donation Dashboard
```

### Spending Proof Flow

```text
NGO
 │
 ▼
Record Fund Usage
 │
 ▼
Upload Receipt / Evidence
 │
 ▼
Pinata
 │
 ▼
IPFS CID
 │
 ▼
Associate CID With Spending Record
 │
 ▼
Donor Verification
```

This creates a relationship between:

**Donation → Transaction → Spending → Proof**

---

## Tech Stack

### Frontend

* React
* Vite
* TypeScript / JavaScript
* Tailwind CSS
* Framer Motion
* Lucide React
* Axios

### Backend

* Python
* FastAPI
* SQLAlchemy
* REST APIs

### Database

* PostgreSQL

### Blockchain

* Cardano
* Blockfrost API
* Lucid
* MeshJS

### Decentralized Storage

* IPFS
* Pinata

### Development

* Git
* GitHub
* Postman
* Linux / Windows development environment

---

## Project Structure

Adapt this section to match the actual repository:

```text
DONOTRACK/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── auth.py
│   │   ├── auth_clerk.py
│   │   ├── websockets.py
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   ├── campaigns.py
│   │   │   ├── donations.py
│   │   │   ├── ngo.py
│   │   │   ├── donor.py
│   │   │   ├── updates.py
│   │   │   ├── wallet.py
│   │   │   ├── stats.py
│   │   │   ├── notifications.py
│   │   │   ├── disputes.py
│   │   │   └── admin.py
│   │   └── services/
│   │       ├── blockfrost_service.py
│   │       ├── ipfs_service.py
│   │       └── email_service.py
│   ├── alembic/
│   ├── tests/
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## API Design

The FastAPI backend exposes the following REST API endpoints:

| Method | Endpoint | Purpose | Authentication |
| ------ | -------- | ------- | -------------- |
| `POST` | `/api/auth/signup` | Register user | None |
| `POST` | `/api/auth/login` | Authenticate user & get JWT | None |
| `POST` | `/api/auth/send-verification-otp` | Send email verification OTP | None |
| `POST` | `/api/auth/verify-email-otp` | Verify OTP | None |
| `GET`  | `/api/campaigns/` | List active campaigns | None |
| `POST` | `/api/campaigns/` | Create campaign | NGO / Bearer |
| `GET`  | `/api/campaigns/{id}` | Get campaign details | None |
| `POST` | `/api/donations/intent` | Create donation intent | Donor / Bearer |
| `POST` | `/api/donations/submit-tx` | Submit Cardano tx CBOR | Donor / Bearer |
| `GET`  | `/api/ngo/profile` | Retrieve NGO profile | NGO / Bearer |
| `POST` | `/api/ngo/kyc/upload` | Upload KYC proof to IPFS | NGO / Bearer |
| `GET`  | `/api/donor/profile` | Retrieve donor profile | Donor / Bearer |
| `GET`  | `/api/updates/` | List spending updates & proofs | None |
| `POST` | `/api/updates/` | Post spending update with IPFS CID | NGO / Bearer |
| `GET`  | `/api/stats/overview` | Platform metrics & totals | None |
| `GET`  | `/api/wallet/info` | Cardano wallet info | Bearer |


---

## Database Design

DonoTrack uses PostgreSQL for persistent application data.

The database should maintain relationships between the major entities involved in the donation workflow.

Conceptually:

```text
User
 │
 ├──────────────< Donation
 │                    │
 │                    ▼
 │               Transaction
 │
 └──────────────< Campaign
                      │
                      ▼
                  Fund Usage
                      │
                      ▼
                  IPFS Proof
```

### Core Data Relationships

```text
Campaign
   │
   └──< Donation
           │
           └── Transaction

Campaign
   │
   └──< Fund Usage
           │
           └── IPFS Proof
```

<!-- Add an ER diagram here if you have one -->

> Only include this image if you have a real database/ER diagram.

---

## Authentication & Security

Security is important because the system handles donation-related information and interactions with external services.

Document the mechanisms actually implemented in the repository.

Areas to document:

* User authentication
* Role-based access
* Password security
* API authorization
* Input validation
* CORS configuration
* Environment-based secrets
* Blockchain API credentials
* IPFS credentials

### Secret Management

External credentials should be stored in environment variables rather than committed to the repository.

Example:

```env
DATABASE_URL=your_database_url
BLOCKFROST_API_KEY=your_blockfrost_key
PINATA_API_KEY=your_pinata_key
```

**Never commit real credentials.**

---

## Installation

### Prerequisites

* Node.js 16+
* Python 3.9+
* Git
* PostgreSQL
* Cardano / Blockfrost access
* Pinata / IPFS access

### Clone Repository

```bash
git clone https://github.com/SATYANARAYANA-J/DONOTRACK.git

cd DONOTRACK
```

---

## Environment Variables

Create a `.env` file inside the backend directory.

Example:

```env
DATABASE_URL=your_postgresql_connection_string

BLOCKFROST_API_KEY=your_blockfrost_api_key

PINATA_API_KEY=your_pinata_api_key

PINATA_SECRET_KEY=your_pinata_secret
```

Use the **exact variable names from your implementation**.

Do not publish real credentials.

---

## Running Locally

### Backend

```bash
cd backend

python -m venv venv
```

Windows:

```bash
.\venv\Scripts\activate
```

macOS / Linux:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start FastAPI:

```bash
uvicorn app.main:app --reload --port 8000
```

Backend:

```text
http://localhost:8000
```

FastAPI documentation:

```text
http://localhost:8000/docs
```

---

### Frontend

Open another terminal:

```bash
cd frontend

npm install

npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## Testing

### Backend Automated Unit & Integration Tests

The backend includes automated test suites covering authentication, campaign operations, donations, spending updates, and Cardano wallet flows using `pytest`:

```bash
cd backend
python -m pytest
```

Test suite coverage:
* `tests/test_auth.py`: Signup & JWT authentication flows
* `tests/test_campaigns.py`: Campaign creation & listing
* `tests/test_donations.py`: Donation intent & status tracking
* `tests/test_updates.py`: NGO spending proof submission & retrieval
* `tests/test_wallet_flow.py`: Cardano donation intent & transaction submission
* `tests/test_admin.py`: Admin access controls & statistics

### Frontend Production Build Verification

```bash
cd frontend
npm run build
```

### Interactive API Documentation

FastAPI provides an interactive OpenAPI / Swagger UI for live API testing:

```text
http://localhost:8000/docs
```




## Future Improvements

Potential improvements include:

* Multi-signature donation workflows
* More advanced on-chain verification
* Improved NGO verification mechanisms
* Automated transaction reconciliation
* Advanced analytics
* Notification services
* Enhanced fraud detection
* Mobile application
* Automated integration testing
* Production-grade monitoring
* Improved decentralized identity integration

---

## Author

**Satyanarayana J**

Backend-Focused Full-Stack Developer

**Primary contribution to DonoTrack:** Backend development and blockchain-related integration.

**Focus:** System Design • APIs • Databases • AI Integration

* GitHub: [SATYANARAYANA-J](https://github.com/SATYANARAYANA-J)
* Portfolio: [satyanarayana-j.lovable.app](https://satyanarayana-j.lovable.app/)
* LinkedIn: [Connect with me](www.linkedin.com/in/j-satyanarayana)

---

## Engineering Focus

DonoTrack demonstrates practical engineering across:

**React → REST APIs → FastAPI → PostgreSQL → Cardano → IPFS**

The project explores how conventional backend architecture can work alongside decentralized infrastructure to create a more transparent application.

> **The interesting engineering problem is not simply storing a donation on a blockchain. It is connecting application data, blockchain transactions, and independently stored evidence into one traceable workflow.**
