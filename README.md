# Personality Test Hub

A comprehensive web application that allows users to take three major personality tests: DISC, MBTI, and the Big Five. The app provides detailed interpretations, saves results to the browser, and allows users to export their reports to PDF.

This application is **trilingual** (English, Portuguese, and Spanish) and features a resilient front-end that can function with or without the backend API.

## 🚀 Features

* **Three Full Tests:**
    * **DISC:** 30 questions to determine your Dominance, Influence, Steadiness, and Conscientiousness profile.
    * **MBTI:** 28 questions to determine your 4-letter Myers-Briggs type.
    * **Big Five (OCEAN):** 40 questions to score you on Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism.
* **Trilingual Support:** All questions and interface elements are available in **English**, **Portuguese (BR)**, and **Spanish**.
* **PDF Export:** Export your detailed results page to a clean PDF document using `html2pdf.js`.
* **Secure Configuration:** Uses environment variables (`.env`) to manage database credentials securely.
* **Resilient Data Fetching:** The app first tries to fetch questions from the Node.js backend API. If the server is down, it seamlessly falls back to loading questions from a local `fallback-questions.json` file.
* **Local Storage:**
    * **Progress Saving:** Automatically saves your answers as you take a test, so you can resume later.
    * **Result Saving:** Saves your completed test results to the browser, which are displayed on the main hub page.
* **Accessibility:** Built with accessibility in mind, featuring ARIA roles, live regions for screen readers, and full keyboard navigation support.
* **Responsive Design:** A clean, mobile-first interface built with Tailwind CSS.

## 🛠️ Tech Stack

* **Front-End:**
    * HTML5
    * Tailwind CSS (Local CLI Build)
    * JavaScript (ES6+)
    * [html2pdf.js](https://github.com/eKoopmans/html2pdf.js)
* **Back-End (API):**
    * Node.js
    * Express.js
    * `cors`
    * `dotenv` (Environment variables)
* **Database:**
    * Microsoft SQL Server
    * `mssql` Node.js Driver

## 🏗️ Architecture

This project is a full-stack application with three main components:

1.  **Front-End (Client):** A set of static HTML files (`index.html`, `disc.html`, etc.) powered by a single, comprehensive `script.js` file. This client handles all UI, state management, scoring logic, and data fetching.
2.  **Back-End (API):** A simple `server.js` file that runs an Express API. Its sole purpose is to connect to the SQL Server database using credentials from `.env` and serve the test questions via a `GET /api/questions/:testType` endpoint.
3.  **Database Tooling:** A `migrate-questions.js` script that acts as a one-time setup tool. It reads all questions from `fallback-questions.json` and populates your SQL database.

## ⚙️ Installation and Setup

To run this project locally, you must set up the database, environment variables, dependencies, and styles.

### 1. Database Setup

1.  Ensure you have a Microsoft SQL Server instance running.
2.  Create a new, empty database named `personality_tests`.

### 2. Project & Environment Setup

1.  Open a terminal in the project root.
2.  Install the required Node.js dependencies:
    ```sh
    npm install
    ```
3.  **Create a `.env` file** in the root of the project to store your secrets safely. Add the following content, adjusting the values to match your SQL Server:
    ```env
    DB_USER=SA
    DB_PASSWORD=YourStrongPassword123
    DB_SERVER=localhost
    DB_DATABASE=personality_tests
    ```

### 3. CSS Build (Tailwind)

This project uses Tailwind CSS locally for better performance.

1.  Initialize and build the CSS:
    ```sh
    npm run build:css
    ```
    *(Or run `npm run dev:css` to watch for changes during development)*.

### 4. Database Migration

1.  Run the migration script to populate the database with questions. **This is a mandatory step.**
    ```sh
    node migrate-questions.js
    ```
    This script will connect to your database using the `.env` credentials, create the necessary tables, and insert all questions from `fallback-questions.json`.

2.  (Optional) Verify the migration:
    ```sh
    node verify-migration.js
    ```
    This should report the correct number of questions (DISC: 30, MBTI: 28, Big5: 40).

### 5. Running the Application

1.  **Start the Backend API:**
    ```sh
    node server.js
    ```
    The API will be running at `http://localhost:3000`.

2.  **Start the Front-End:**
    Simply **open the `index.html` file** in your web browser. The app will connect to your `localhost:3000` API automatically.

## 📁 File Structure

```text
├── index.html              # The main landing page/hub
├── disc.html               # DISC test page
├── mbti.html               # MBTI test page
├── big5.html               # Big Five test page
├── disc-result.html        # Standalone page for showing saved DISC results
├── mbti-result.html        # Standalone page for showing saved MBTI results
├── big5-result.html        # Standalone page for showing saved Big Five results
│
├── script.js               # The main client-side JavaScript for ALL pages
├── input.css               # Tailwind CSS entry point
├── output.css              # Compiled CSS (generated by Tailwind)
├── tailwind.config.js      # Tailwind configuration
│
├── server.js               # The Node.js/Express backend API
├── migrate-questions.js    # The database setup/migration script
├── verify-migration.js     # A helper script to check DB integrity
├── .env                    # Environment variables (Gitignored)
│
├── fallback-questions.json # JSON data with all questions and translations
├── package.json            # Node.js dependencies
└── README.md               # You are here
