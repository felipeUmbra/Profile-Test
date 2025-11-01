# Personality Test Hub

A comprehensive web application that allows users to take three major personality tests: DISC, MBTI, and the Big Five. The app provides detailed interpretations, saves results to the browser, and allows users to export their reports to PDF.

This application is bilingual (English and Portuguese) and features a resilient front-end that can function with or without the backend API.

## 🚀 Features

* **Three Full Tests:**
    * **DISC:** 30 questions to determine your Dominance, Influence, Steadiness, and Conscientiousness profile.
    * **MBTI:** 28 questions to determine your 4-letter Myers-Briggs type.
    * **Big Five (OCEAN):** 40 questions to score you on Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism.
* **Bilingual Support:** All questions and interface elements are available in English and Portuguese.
* **PDF Export:** Export your detailed results page to a clean PDF document using `html2pdf.js`.
* **Resilient Data Fetching:** The app first tries to fetch questions from the Node.js backend API. If the server is down, it seamlessly falls back to loading questions from a local `fallback-questions.json` file.
* **Local Storage:**
    * **Progress Saving:** Automatically saves your answers as you take a test, so you can resume later.
    * **Result Saving:** Saves your completed test results to the browser, which are displayed on the main hub page.
* **Accessibility:** Built with accessibility in mind, featuring ARIA roles, live regions for screen readers, and full keyboard navigation support.
* **Responsive Design:** A clean, mobile-first interface that scales from small phones to large desktops.

## 🛠️ Tech Stack

* **Front-End:**
    * HTML5
    * Tailwind CSS (via Play CDN for development)
    * JavaScript (ES6+)
    * [html2pdf.js](https://github.com/eKoopmans/html2pdf.js)
* **Back-End (API):**
    * Node.js
    * Express.js
    * `cors`
* **Database:**
    * Microsoft SQL Server
    * `mssql` Node.js Driver

## 🏗️ Architecture

This project is a full-stack application with three main components:

1.  **Front-End (Client):** A set of static HTML files (`index.html`, `disc.html`, etc.) powered by a single, comprehensive `script.js` file. This client handles all UI, state management, scoring logic, and data fetching.
2.  **Back-End (API):** A simple `server.js` file that runs an Express API. Its sole purpose is to connect to the SQL Server database and serve the test questions via a `GET /api/questions/:testType` endpoint.
3.  **Database Tooling:** A `migrate-questions.js` script that acts as a one-time setup tool. It reads all questions from `fallback-questions.json` and populates your SQL database.



## ⚙️ Installation and Setup

To run this project locally, you must set up the database, backend API, and then run the front-end.

### 1. Database Setup

1.  Ensure you have a Microsoft SQL Server instance running.
2.  Create a new, empty database named `personality_tests`.
3.  In the project root, open `server.js`, `migrate-questions.js`, and `verify-migration.js`. Update the `dbConfig` object in all three files with your SQL Server credentials:

    ```javascript
    const dbConfig = {
        server: 'localhost',
        database: 'personality_tests',
        user: 'SA', // Your SQL Server username
        password: 'Shopee123', // Your SQL Server password
        options: {
            // ...
        }
    };
    ```

### 2. Backend Setup & Migration

1.  Open a terminal in the project root.
2.  Install the required Node.js dependencies:
    ```sh
    npm install
    ```
    (This will install `express`, `cors`, and `mssql`).
3.  Run the database migration script. **This is a mandatory step.**
    ```sh
    node migrate-questions.js
    ```
    This script will connect to your database, create the necessary tables, and insert all 98 questions from `fallback-questions.json`.
4.  (Optional) Verify the migration:
    ```sh
    node verify-migration.js
    ```
    This should report the correct number of questions (DISC: 30, MBTI: 28, Big5: 40).

### 3. Running the Application

1.  **Start the Backend API:**
    ```sh
    node server.js
    ```
    The API will be running at `http://localhost:3000`.

2.  **Start the Front-End:**
    No web server is needed. Simply **open the `index.html` file** in your web browser. The app will connect to your `localhost:3000` API automatically.

---

## 🚀 Moving to Production (Tailwind CSS)

The project currently uses the Tailwind Play CDN for development. This is slow and not suitable for a live website.

To create a production-ready build, you must compile the CSS using the Tailwind CLI.

1.  Install Tailwind CSS:
    ```sh
    npm install -D tailwindcss
    ```
2.  Create a Tailwind config file:
    ```sh
    npx tailwindcss init
    ```
3.  Configure `tailwind.config.js` to scan your HTML files:
    ```js
    module.exports = {
      content: ["./*.html"],
      // ...
    }
    ```
4.  Create a main CSS file (e.g., `src/input.css`) and add the Tailwind directives:
    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    /* Paste the contents of your existing style.css here */
    ```
5.  Run the build command:
    ```sh
    npx tailwindcss -i ./src/input.css -o ./style.css
    ```
6.  Finally, **remove the Tailwind CDN script** from all your HTML files:
    ```html
    <script src="[https://cdn.tailwindcss.com](https://cdn.tailwindcss.com)"></script>
    ```
    Your static `style.css` file now contains all the necessary Tailwind classes.

## 📁 File Structure
- ├── index.html            # The main landing page/hub
- ├── disc.html             # DISC test page
- ├── mbti.html             # MBTI test page
- ├── big5.html             # Big Five test page
- ├── disc-result.html      # Standalone page for showing saved DISC results
- ├── mbti-result.html      # Standalone page for showing saved MBTI results
- ├── big5-result.html      # Standalone page for showing saved Big Five results
- │
- ├── script.js             # The main client-side JavaScript for ALL pages
- ├── style.css             # All custom styles
- │
- ├── server.js             # The Node.js/Express backend API
- ├── migrate-questions.js  # The database setup/migration script
- ├── verify-migration.js   # A helper script to check DB integrity
- │
- ├── fallback-questions.json # JSON data with all questions and translations
- ├── package.json          # Node.js dependencies
- └── README.md             # You are here

## 📄 License
This project is licensed under the MIT License.
