# Trello Clone — Backend

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Add your Neon Connection String
Open `.env` and replace `your_neon_connection_string_here` with your actual URL from [Neon Console](https://console.neon.tech).

```
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### 3. Run Database Migration (creates all tables)
```bash
npm run db:migrate
```

### 4. Seed Sample Data
```bash
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```

Server starts on `http://localhost:5000`.  
Health check: `GET http://localhost:5000/api/health`

---

## API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/boards` | All boards |
| POST | `/api/boards` | Create board |
| GET | `/api/boards/:id` | Board with lists, cards, labels, members |
| PUT | `/api/boards/:id` | Update board |
| DELETE | `/api/boards/:id` | Delete board |
| POST | `/api/boards/:boardId/lists` | Create list |
| GET | `/api/boards/:boardId/labels` | Board labels |
| POST | `/api/boards/:boardId/labels` | Create label |
| GET | `/api/boards/:boardId/search` | Search/filter cards |
| PUT | `/api/lists/reorder` | Reorder lists (DnD) |
| PUT | `/api/lists/:id` | Update list title |
| DELETE | `/api/lists/:id` | Delete list |
| PUT | `/api/cards/reorder` | Move/reorder cards (DnD) |
| GET | `/api/cards/:id` | Card full detail |
| PUT | `/api/cards/:id` | Update card |
| DELETE | `/api/cards/:id` | Delete card |
| POST | `/api/cards/:cardId/labels/:labelId` | Add label to card |
| DELETE | `/api/cards/:cardId/labels/:labelId` | Remove label from card |
| POST | `/api/cards/:cardId/members/:memberId` | Assign member |
| DELETE | `/api/cards/:cardId/members/:memberId` | Remove member |
| POST | `/api/cards/:cardId/checklists` | Create checklist |
| PUT | `/api/checklists/:id` | Update checklist title |
| DELETE | `/api/checklists/:id` | Delete checklist |
| POST | `/api/checklists/:checklistId/items` | Add checklist item |
| PUT | `/api/checklist-items/:id` | Toggle/update item |
| DELETE | `/api/checklist-items/:id` | Delete item |
| GET | `/api/members` | All members |
| PUT | `/api/labels/:id` | Update label |
| DELETE | `/api/labels/:id` | Delete label |
