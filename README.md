# serialization_banchmark
Clean comparison of serialization formats showing how payload size, server time, and latency vary across JSON, MessagePack, and Protobuf.
Here’s a **short, clean, and professional README** you can use for GitHub 👇

---

# 🧠 API Serialization Benchmark

JSON vs MessagePack vs Protobuf

---

## 🚀 Overview

A simple React + Node.js demo to compare how different serialization formats impact:

* 📦 Payload size
* ⚡ Server processing time
* 🌐 Latency

---

## ⚙️ Tech Stack

* React (Frontend)
* Node.js + Express (Backend)
* JSON, MessagePack, Protobuf

---

## 📊 Key Insight

JSON is simple but larger in size.
Binary formats reduce payload size but may add CPU overhead.

👉 At scale, smaller payloads improve performance significantly.

---

## ▶️ How to Run

### 1. Clone Repo

```bash
git clone https://github.com/your-username/api-serialization-benchmark.git
cd api-serialization-benchmark
```

### 2. Run Backend

```bash
cd backend
npm install
node server.js
```

### 3. Run Frontend

```bash
cd frontend
npm install
npm start
```

---

## 📁 Structure

```bash
backend/
  ├── server.js
  ├── user.proto

frontend/
  ├── src/App.js
```

---

## 📸 Demo

<img width="1895" height="652" alt="image" src="https://github.com/user-attachments/assets/1640be1f-520b-4b25-82b6-4e34d561f362" />


---

## 💡 Takeaway

Serialization format is not just implementation —
it’s a system design decision.

---

## ⭐ Support

Star ⭐ the repo if you found it useful!
