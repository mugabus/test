# 🛒 React Checkout Page with MetaMask Payment Integration

This project is a checkout page built using **React**, **Redux**, and **Ethers.js**. It allows users to view their cart, enter billing details, and pay via **MetaMask** on the Ethereum network.

---

## 🚀 Features

- 🛍️ View dynamic cart items (from Redux store)
- 📋 Billing address and credit card form (currently non-functional)
- 🦊 MetaMask integration using Ethers.js
  - Connect / Disconnect wallet
  - Simulate sending a small Ether transaction
  - Show transaction status and confirmation
- 💡 Conditional rendering: Empty cart message vs. checkout UI
- 🧩 Modularized code for better readability and reuse

---

I created a Hardhat project to test and verify that the payment functionality works not only in simulation, but also with real transactions using Hardhat accounts imported into MetaMask.