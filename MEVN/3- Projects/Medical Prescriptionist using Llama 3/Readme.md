
---

# **Medical Prescriptionist Using Llama 3**

## **Introduction**

This repository implements an intelligent **Medical Prescriptionist** system that utilizes **Llama 3** for generating medical advice and prescriptions based on patient input. The system is built using the **MEVN Stack** (MongoDB, Express.js, Vue.js, Node.js) and allows healthcare professionals or patients to input symptoms and receive AI-generated prescriptions or medical advice.

### **Purpose of This Repository**

This project aims to:
- Leverage **Llama 3** for AI-based prescription generation.
- Use the **MEVN Stack** to build a full-stack application with MongoDB as the database for storing patient records and prescription history.
- Provide a simple interface for healthcare workers to input symptoms and receive AI-powered medical advice.

## **Table of Contents**

- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
  - [Llama 3](#llama-3)
  - [MEVN Stack](#mevn-stack)
  - [MongoDB](#mongodb)
- [Architecture](#architecture)
  - [Overview](#overview)
  - [System Components](#system-components)
- [Setup and Installation](#setup-and-installation)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Project](#running-the-project)
- [Usage](#usage)
  - [Symptom Input](#symptom-input)
  - [Prescription Generation](#prescription-generation)
  - [Prescription History](#prescription-history)
- [Contributing](#contributing)
- [License](#license)

---

## **Features**

- **AI-Generated Prescriptions**: Input patient symptoms and receive AI-based medical advice and prescriptions via Llama 3.
- **Symptom Matching**: Matches symptoms with common medical conditions and suggests appropriate medications.
- **Prescription History**: Maintain patient records, including past symptoms and prescriptions for ongoing care.
- **Full-Stack MEVN Application**: Provides a robust, scalable system for medical practices to easily interact with patients and their data.

---

## **Tech Stack**

### **Llama 3**

**Llama 3** is an advanced AI model that powers the medical prescriptionist's backend. It generates medical advice based on input symptoms, helping to provide prescriptions for common ailments.

- **Key Features**:
  - NLP-based analysis of patient symptoms.
  - Flexible prescription generation for a range of common and complex conditions.
  - Real-time medical recommendations to support healthcare providers.

### **MEVN Stack**

The **MEVN Stack** consists of MongoDB, Express.js, Vue.js, and Node.js, and provides the foundation for the full-stack web application:

- **MongoDB**: A NoSQL database used to store patient records, prescriptions, and historical data.
- **Express.js**: A Node.js web application framework that handles the backend API and routes.
- **Vue.js**: A progressive JavaScript framework used for building the frontend user interface where users input symptoms and view prescriptions.
- **Node.js**: The server-side runtime that powers the backend logic and connects to Llama 3.

### **MongoDB**

**MongoDB** is the database layer used to store user and patient data securely, including historical prescriptions and health records.

- **Key Features**:
  - Stores and retrieves patient information and prescription history.
  - Scalable document-based storage for healthcare applications.
  - Supports real-time data retrieval for fast, dynamic interfaces.

---

## **Architecture**

### **Overview**

The system architecture combines a frontend built with **Vue.js**, a backend powered by **Express.js** and **Node.js**, and a **MongoDB** database. **Llama 3** serves as the core AI model, processing symptoms and generating prescriptions.

### **System Components**

- **Frontend**: Built using **Vue.js**, the frontend allows users (healthcare professionals or patients) to input symptoms and view generated prescriptions.
- **Backend**: **Node.js** with **Express.js** handles API requests, connects to the database, and processes symptom data through **Llama 3**.
- **Database**: **MongoDB** stores patient information, symptoms, and generated prescriptions.
- **Llama 3 Integration**: **Llama 3** processes the medical input and provides real-time medical advice and prescriptions.

---

## **Setup and Installation**

### **Prerequisites**

Ensure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (Local or cloud instance)
- **Llama 3 API Access** (via OpenAI or other provider)

### **Installation**

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/medical-prescriptionist-llama3.git
   cd medical-prescriptionist-llama3
   ```

2. **Install Backend Dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

4. **Set Up MongoDB**:
   - Ensure your MongoDB server is running (either locally or using a cloud provider like MongoDB Atlas).

5. **Set Up Llama 3 API**:
   - Obtain an API key from the Llama 3 provider and add it to the `.env` file for the backend.

6. **Configure Backend**:
   - Add your MongoDB URI and Llama 3 API key to the `.env` file in the `backend` folder.

### **Running the Project**

1. **Run the Backend**:
   ```bash
   cd backend
   npm start
   ```

2. **Run the Frontend**:
   ```bash
   cd frontend
   npm run serve
   ```

3. **Ensure MongoDB** is running to store patient and prescription data.

---

## **Usage**

### **Symptom Input**

- The system allows healthcare professionals or patients to input a list of symptoms (e.g., fever, headache, fatigue).
- Symptoms are processed using **Llama 3**, which analyzes the data to identify potential conditions.

### **Prescription Generation**

- Based on the symptoms entered, the **Medical Prescriptionist** generates AI-based medical advice and prescriptions, including suggested medications and dosage information.
- **Llama 3** uses its language model capabilities to provide accurate and real-time responses.

### **Prescription History**

- All prescriptions are stored in **MongoDB**, allowing the healthcare professional to review past prescriptions and patient records.
- Historical data is accessible through the frontend interface for tracking treatment progress.

---

## **Contributing**

Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/new-feature`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push the branch (`git push origin feature/new-feature`).
5. Open a Pull Request.

---

## **License**

This project is open to everyone. No licenses—just have fun and learn!

---
