# Trello Clone

A full-stack Kanban application with a refined dark-themed interface and smooth drag-and-drop interactions. Designed for efficient task management and scalable performance.

---

## Tech Stack

### Frontend

* Next.js 14 (App Router)
* TypeScript
* Tailwind CSS
* lucide-react (Icons)
* dnd-kit (Drag and Drop)

### Backend

* Express.js
* TypeScript
* PostgreSQL (Neon DB)
* Zod (Validation)

---

## Features

* Drag-and-drop functionality for lists and cards
* Detailed task management:

  * Checklists
  * Labels
  * Members
  * Cover images
* Task archiving and permanent deletion
* Responsive design with collapsible board lists
* Dark-themed UI with gradient styling
* Gap-based positioning system for efficient reordering

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/HarshCule10/TRELLOCLONE.git
cd TRELLOCLONE
```

---

## Database Setup

This project uses PostgreSQL via Neon.

### 1. Create a Database

* Go to https://neon.tech
* Create a new project
* Copy the connection string

Example:

```
postgresql://username:password@host/database?sslmode=require
```

---

### 2. Configure Backend Environment

Create a `.env` file inside the `backend` folder:

```
DATABASE_URL=your_database_url
PORT=5000
```

---

### 3. Apply Database Schema

```
npm run migrate
```

---

### 4. Seed Initial Data

```
node seed.js
```

---

## Backend Setup

```bash
cd backend
npm install
npm run dev
```

---

## Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Run the frontend:

```bash
npm run dev
```

---

## Assumptions

* Initial users are created using the seed script
* List and card positions use gap-based indexing (e.g., 1000, 2000)
* Archived cards are stored separately and excluded from the main board view

---

## Notes

* Ensure backend is running before starting the frontend
* The project is structured for independent deployment (e.g., Vercel for frontend and Render for backend)

---

## Environment Variables

Example `.env.example`:

```
DATABASE_URL=
PORT=5000
NEXT_PUBLIC_API_URL=http://localhost:5000
```
