# PaisaTrack — Expense Tracker

PaisaTrack is a full-stack MERN Expense Tracker application that helps users record income and expenses, monitor savings, and manage transactions through a simple, responsive dashboard.

## Features

- Add, edit, and delete transactions
- Track income and expenses by category
- View total income, total expenses, and net savings
- Filter transactions by type, category, and date
- Clear filters to view all transactions
- Client-side and server-side validation
- Store transaction data persistently in MongoDB
- Responsive interface for desktop and mobile devices

## Technologies Used

**Frontend**
- React
- Vite
- Axios
- Lucide React
- CSS

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- dotenv
- CORS

## Project Structure

```text
expense tracker_application/
├── vite-project/
│   ├── src/
│   ├── package.json
│   └── ...
├── Backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── .env
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB Atlas account or a MongoDB server
- Visual Studio Code (recommended)

### 1. Configure the Backend

Open a terminal in the project root and run:

```bash
cd Backend
npm install
```

Create a `.env` file inside the `Backend` folder with these variables:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Replace the placeholder with your MongoDB connection string. Never commit real database credentials to GitHub.

Start the backend:

```bash
npm run dev
```

The API runs at `http://localhost:5000`, provided the port is available and the database connection succeeds.

### 2. Configure the Frontend

Open a second terminal in the project root and run:

```bash
cd vite-project
npm install
npm run dev
```

Open the local URL displayed by Vite, usually `http://localhost:5173`.

Keep both terminals running while using the application.

## REST API Endpoints

Base URL: `http://localhost:5000/api/transactions`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Retrieve all transactions |
| POST | `/` | Create a transaction |
| GET | `/summary` | Retrieve income, expense, and net savings totals |
| PUT | `/:id` | Update a transaction |
| DELETE | `/:id` | Delete a transaction |

### Transaction Data Model

Each transaction contains:

| Field | Type | Description |
|---|---|---|
| `title` | String | Transaction title |
| `amount` | Number | Transaction amount; must be greater than zero |
| `type` | String | `income` or `expense` |
| `category` | String | Transaction category |
| `date` | Date | Transaction date |
| `description` | String | Optional description |
| `createdAt` | Date | Automatically generated creation timestamp |
| `updatedAt` | Date | Automatically generated update timestamp |

Mongoose schema validation is used on the backend. The frontend also validates user input before submitting transactions.

## Summary Calculations

- **Total Income:** Sum of all income transactions
- **Total Expenses:** Sum of all expense transactions
- **Net Savings:** Total income minus total expenses

The summary values are calculated by the backend using stored transaction records.

## Data Persistence

Transactions are stored in MongoDB, so saved records remain available after restarting the backend, provided the database remains accessible.

## Screenshots and Demo

Add screenshots of the dashboard, transaction form, filters, and transaction history here before submission.

- **GitHub Repository:** Add your repository URL here.
- **Live Demo / Walkthrough:** Add your deployed application link or demo video link here, if available.

## Author

Developed as a full-stack development internship project for CodeNova.
