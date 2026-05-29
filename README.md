# Intergalactic Cargo Triager

This repository contains a full-stack monorepo solution for parsing, serving, and displaying legacy cargo manifests.

## Prerequisites
- **Node.js** installed (for the backend API and frontend dashboard)
- **Python 3.x** installed (for the initial manifest parser)

## Project Architecture
* `parser.py`: Python script located at the root that parses raw `manifest.txt` data, applies business logic (Prime Number removal, Sector-7 multipliers), and generates the JSON dataset.
* `backend/`: A Node.js/Express REST API that serves the parsed cargo data and enforces system override rules.
* `frontend/`: A React (Vite) single-page application that fetches, sorts, and visualizes the data on an interactive dashboard.

## How to Run the Project Locally

### 1. Data Parsing (Task 1)
The generated JSON data is already included in the repository, but to test the parser directly, run this command from the root directory:
\`\`\`bash
python parser.py
\`\`\`

### 2. Start the Backend API (Task 2)
You will need two terminal windows to run the web application. Open your first terminal and navigate to the `backend` directory:
\`\`\`bash
cd backend
node server.js
\`\`\`
The backend will run on `http://localhost:3000`.

### 3. Start the Frontend Dashboard (Task 3)
Open a second terminal and navigate to the `frontend` directory:
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
The frontend will run on `http://localhost:5173`. Open this URL in your browser to view the interactive dashboard.