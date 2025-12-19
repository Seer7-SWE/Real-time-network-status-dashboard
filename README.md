# 📡 Real-Time Network Status Dashboard

**Telecom Network Monitoring & Analytics Platform (Prototype)**

🔗 **Live Demo:**
[https://real-time-network-status-dashboard.netlify.app/](https://real-time-network-status-dashboard.netlify.app/)
**Admin Login:**

* Username: `admin`
* Password: `password123`

📁 **Source Code:**
[https://github.com/Seer7-SWE/Real-time-network-status-dashboard](https://github.com/Seer7-SWE/Real-time-network-status-dashboard)

---

## 🧭 Overview

The **Real-Time Network Status Dashboard** is a telecom-focused monitoring and analytics platform designed to visualize network health, outages, congestion, and performance trends across multiple regions in real time.

This project simulates how **Network Operations Centers (NOC)** and **telecom engineering teams** monitor infrastructure reliability, respond to incidents, and generate management-level reports — aligned with real-world workflows used by operators such as **Zain Bahrain, Omantel, Batelco, and regional telecom solution providers**.

> ⚠️ Note: This is a **production-style prototype** built for demonstration, learning, and evaluation purposes. The architecture is intentionally designed so it can later be connected to real OSS/BSS, SNMP, or monitoring APIs.

---

## 🎯 Key Objectives

* Simulate **real-time telecom network incidents** (outages, congestion).
* Provide **visual and analytical insights** for engineers and decision-makers.
* Demonstrate **enterprise-ready frontend architecture** with extensibility for real backend integration.
* Go beyond generic dashboards and reflect **telecom-industry workflows**.

---

## 🚀 Core Features

### 🌍 Live Network Map (Leaflet.js)

* Interactive map of Bahrain regions.
* **Severity-based visualization**:

  * 🟢 Normal
  * 🟡 Congestion
  * 🔴 Outage
* Supports:

  * Marker view
  * Marker clustering
  * Heatmap view (issue density & severity)
* Clickable regions showing contextual incident data.

---

### 🚨 Real-Time Incident & Alert System

* Live incident feed with:

  * Region
  * Incident type (Outage / Congestion)
  * Severity (Low / Medium / High)
  * Service affected (Mobile Data / Voice / SMS)
  * Timestamp
* Optional popup/toast notifications for high-severity incidents.
* Alerts update **without page refresh** (event-driven simulation).

---

### 📊 Analytics & Insights

* Region-wise instability comparison (e.g., Manama vs Riffa).
* Historical incident trends.
* Simulated KPIs:

  * Uptime %
  * MTTR (Mean Time To Repair)
  * Incident count per region
* Designed to mirror **NOC dashboards & management reports**.

---

### 🧩 Region Health Cards

* Per-region overview cards showing:

  * Current status
  * Last incident
  * Uptime estimation
* Interactive:

  * Click to filter data by region.
  * Double-click to reset and return to global live view.

---

### 📄 Export & Reporting

* **CSV export** of incident history.
* **PDF export** for management-ready reports.
* Designed to reflect “report to management” or SLA review use cases.

---

### 🌗 Professional UI/UX

* Clean, modern dashboard layout.
* Light / Dark mode toggle.
* Responsive grid layout (desktop & tablet friendly).
* Consistent card-based design aligned with enterprise dashboards.

---

### 🔐 Authentication & Roles (Prototype)

* Login system with role simulation:

  * **Admin**
  * **Engineer**
  * **Viewer**
* Role-based UI gating (export, controls).
* Clear upgrade path for JWT-based authentication and backend validation.

---

## 🛠️ Technology Stack

### Frontend

* **React + Vite**
* **Tailwind CSS**
* **Leaflet.js** (Map, clustering, heatmaps)
* **Chart.js / Recharts** (Analytics)
* **React Context API** (state management)

### Data & Logic

* Event-driven incident simulation
* Modular data adapters (designed for polling, WebSocket, or API input)
* Efficient filtering & aggregation logic

### Deployment

* **Single deploy architecture**
* Hosted on **Netlify**
* Designed to support Netlify serverless functions for future backend expansion

---

## 🏗️ High-Level Architecture

```
User Interface (React + Tailwind)
        |
        v
Event & Data Adapter Layer
        |
        v
Incident Simulation Engine
        |
        v
Map / Alerts / Analytics Modules
```

> The data layer is intentionally decoupled to allow easy replacement with:
>
> * OSS/BSS APIs
> * SNMP / Prometheus
> * WebSocket streams
> * Backend microservices

---

## 🧪 Demo Credentials

```
Username: admin
Password: password123
```

---

## 📌 Use Cases (Telecom-Relevant)

* Network Operations Center (NOC) monitoring
* Regional outage analysis
* SLA & uptime reporting
* Management incident reviews
* Engineering performance insights

---

## 🔮 Planned Enhancements

* Integration with real monitoring APIs.
* Full JWT-based authentication with token expiry.
* Backend persistence (PostgreSQL / MongoDB).
* Incident correlation & root-cause simulation.
* Mobile-optimized NOC view.
* Automated SLA breach alerts.

---

## 👨‍💻 Author

Developed as a **telecom-aligned engineering project** with focus on:

* Real-world relevance
* Clean architecture
* Scalability & extensibility
* Enterprise-grade presentation

---

