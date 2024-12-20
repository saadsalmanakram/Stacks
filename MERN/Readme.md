
---

# 📝 Checking Prerequisites for Installing and Running MERN Stack

Before setting up a MERN (MongoDB, Express, React, Node) stack application, it’s important to make sure your development environment is ready. This guide covers the necessary prerequisites and how to check them before you begin.

---

## 📦 Prerequisites

You need to have certain tools and technologies installed on your system to run a MERN stack application. Here's a checklist of what you’ll need to have installed:

### 1. **Node.js**
Node.js is a runtime environment that allows you to run JavaScript code on the server side. It is required to run both your backend (Express) and frontend (React) development servers.

#### How to check if Node.js is installed:

Open a terminal and run the following command:

```bash
node -v
```

- If Node.js is installed, you will see the version number like `v14.17.3` or similar.
- If Node.js is not installed, you can download it from the [official website](https://nodejs.org/) and follow the installation instructions.

#### Installation:

1. Go to the [Node.js download page](https://nodejs.org/).
2. Download the installer for your operating system.
3. Run the installer and follow the on-screen instructions.

### 2. **npm (Node Package Manager)**
npm is the package manager for JavaScript that comes bundled with Node.js. You will use npm to install dependencies for both your backend and frontend projects.

#### How to check if npm is installed:

Open a terminal and run:

```bash
npm -v
```

- If npm is installed, it will show the version number.
- If npm is not installed, it should come bundled with Node.js. If it's missing, reinstall Node.js from the [official website](https://nodejs.org/).

#### Installation:

npm comes pre-installed with Node.js, but in case it’s missing, you can install it separately by following instructions [here](https://www.npmjs.com/get-npm).

### 3. **MongoDB**
MongoDB is the database used in the MERN stack. It stores application data in JSON-like format.

#### How to check if MongoDB is installed:

Run the following command in the terminal:

```bash
mongo --version
```

- If MongoDB is installed, it will show the version number (e.g., `v4.4.6`).
- If MongoDB is not installed, you can either install MongoDB locally or use a cloud-based database like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for a hosted solution.

#### Installation:

- **Local Installation**: You can install MongoDB locally by following the instructions on the [MongoDB installation page](https://www.mongodb.com/docs/manual/installation/).
- **MongoDB Atlas (Cloud Solution)**: If you don’t want to install MongoDB locally, you can use MongoDB Atlas, which provides a free tier for hosting your databases in the cloud.

### 4. **Git (Optional but Recommended)**
Git is a version control system that helps track changes in your code and collaborate with other developers.

#### How to check if Git is installed:

Run the following command in your terminal:

```bash
git --version
```

- If Git is installed, it will show the version number (e.g., `git version 2.32.0`).
- If Git is not installed, download and install it from the [official Git website](https://git-scm.com/).

### 5. **Code Editor (Recommended)**
A good code editor is essential for writing and managing code. Popular choices for MERN stack development are:

- **Visual Studio Code** (VSCode) - A powerful, lightweight editor with great JavaScript support.
- **Sublime Text** - A fast, minimalist text editor.
- **Atom** - A customizable editor with many plugins available.

#### Installation:

- **Visual Studio Code**: [Download here](https://code.visualstudio.com/).
- **Sublime Text**: [Download here](https://www.sublimetext.com/).
- **Atom**: [Download here](https://atom.io/).

### 6. **Postman (Optional)**
Postman is an API testing tool that helps you test the endpoints of your backend during development.

#### How to check if Postman is installed:

Run the Postman app, or check from the terminal:

```bash
postman --version
```

- If Postman is installed, it will show the version number.
- If not, you can download it from the [official website](https://www.postman.com/).

---

## 🔧 Setting Up Your Environment

Once the prerequisites are installed, you’ll need to set up both the frontend and backend projects. Follow the steps below to get started:

### Step 1: Set up MongoDB

If you are using MongoDB locally, make sure your MongoDB server is running:

```bash
mongod
```

If you're using MongoDB Atlas, create an account and a database, then get your connection string.

### Step 2: Install Project Dependencies

#### Backend (Node.js + Express):

In your backend project folder, run the following to install dependencies:

```bash
npm install
```

This will install all dependencies listed in your `package.json` file.

#### Frontend (React):

In your frontend project folder, run the following to install dependencies:

```bash
npm install
```

This will install all the required dependencies for React.

### Step 3: Running Your Development Servers

#### Backend (Node.js + Express):

To start your backend server, run:

```bash
npm start
```

Your server will typically run at [http://localhost:5000](http://localhost:5000).

#### Frontend (React):

To start your React development server, run:

```bash
npm start
```

Your React application will run at [http://localhost:3000](http://localhost:3000).

---

## 💡 Tips for a Smooth MERN Stack Setup

- Ensure that both the frontend and backend are running on different ports to avoid conflicts (React typically runs on port 3000, and Express runs on 5000).
- If using MongoDB Atlas, remember to whitelist your IP and configure the connection string correctly in your backend.
- If you encounter any errors, check for typos or mismatched versions between the libraries and frameworks.

---

## 🚀 Additional Resources

- [Node.js Official Website](https://nodejs.org/)
- [MongoDB Official Website](https://www.mongodb.com/)
- [Postman Official Website](https://www.postman.com/)
- [React Official Website](https://reactjs.org/)
- [Express.js Official Website](https://expressjs.com/)

---

This README provides a step-by-step guide to check the prerequisites for installing and running a MERN stack application. Make sure all the necessary tools are installed and properly configured before you begin developing your MERN app.

Happy coding! 🎉

---