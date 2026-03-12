# ECDSA Node Wallet Architecture

A full-stack implementation of Elliptic Curve Digital Signature Algorithm (ECDSA) public-key cryptography. This project demonstrates how blockchain networks securely process transactions without ever exposing user private keys to the internet or a centralized server.

## 🏗️ Architecture

This application simulates a trustless web3 environment by splitting responsibilities across two isolated domains:

1. **The Client (React):** Acts as a secure, local vault. It uses `ethereum-cryptography` to generate mathematical signatures from a user's local private key. It hashes the transaction intent (recipient + amount) using `keccak256` and signs it using `secp256k1`.
2. **The Server (Node.js/Express):** Acts as the decentralized network ledger. It does not store passwords or private keys. Instead, it mathematically recovers the Public Key from the incoming digital signature. If the recovered key matches the requested sender, the transaction is verified and executed.

## 🚀 Quick Start

### 1. Start the Client
```bash
cd client
npm install
npm run dev
```

### Start the Server
```bash
cd server
npm install
node index.js
```

## 🔐 Security Limitations & Future Improvements
Disclaimer: This repository is an educational model of ECDSA architecture.

In a true production environment, handling raw private keys within a browser's memory state (React useState) exposes the user to Cross-Site Scripting (XSS) and memory-scraping attacks. A production-ready deployment of this architecture would delegate the signing process to:

An injected provider/browser extension (e.g., MetaMask).

An encrypted Keystore file mechanism.

A hardware secure element (e.g., Ledger/Trezor) via WebUSB.

## Private Keys Used
Following are dummy private keys used:
```
private key: fdc93a401515fbaf1e208eed15781ec5a8d2f7e8c86fe33bfbc0530b1d4cbabc
public key: 044f240f9fc19df49e2fdb34933887d91fbe64034ab8894858accedf717c964ca36acf851045c94a1c6d993079de3376bc0a5954e45c5ef236613b8a084b3468e9

private key: 230c61e8f6284aa9a400e73a1c0b10992f10d5185286c96bb6b7d8d869f16fd4
public key: 0467b66f31ab2cc958009d02e819332add89f2b2dbf596493f774ff0dafa385138370e76a75064cb1dd519cc7a7fbcd33a31aad22677d44b64e3f6d7f31ac8688d

private key: bf7f5671b1c3f8c4818e160e65362a48099f09624765d524b567aacf1a9a86b2
public key: 04e373a5ff67e20f22d848b48e9cb3e44cb23a13c8edc8f0ea4288892bbb5a806078da5137ab42922ffc2c25683ab54c2a7ef8bd8a547149d50cc5fbb10858c7a5
```


