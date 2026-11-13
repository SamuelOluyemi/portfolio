# Personal Portfolio

A full-stack personal developer portfolio built with **React, TypeScript, Node.js, Express, and PostgreSQL**. The application showcases projects, professional experience, technical skills, and contact information, with a secure admin dashboard for managing portfolio content.

**Live application:** [View Portfolio](https://samueloluyemi.vercel.app/)

**Backend API:** [Portfolio API](https://portfolio-api-frh4.onrender.com/api)

**Repository:** [GitHub – SamuelOluyemi/portfolio](https://github.com/SamuelOluyemi/portfolio)

---

## Features

### Public Portfolio

- Responsive portfolio interface.
- Project showcase with project descriptions, technologies, categories, and links.
- Professional journey and milestone timeline.
- Contact form for visitor inquiries.
- Dynamic content retrieved from the backend API.

### Admin Dashboard

- Secure administrator login and session management.
- Create, read, update, and delete portfolio projects.
- Create, edit, and delete professional journey milestones.
- View and manage contact messages.
- Mark messages as read or unread.
- Archive, restore, and delete messages.
- Protected administrative API endpoints.

### Security

- Session-based administrator authentication.
- Protected routes and API operations.
- Password-based administrator login.
- API rate limiting for public requests.
- Separate rate limiting for contact form submissions.
- Login attempt rate limiting.
- Authenticated administrators are exempt from public API rate limits.
- CORS configuration and Helmet security headers.
- Request validation and JSON request-size limits.

---

## Technology Stack

| Area              | Technologies            |
| ----------------- | ----------------------- |
| Frontend          | React, TypeScript, Vite |
| Styling           | Tailwind CSS            |
| Backend           | Node.js, Express.js     |
| Language          | TypeScript              |
| Database          | PostgreSQL              |
| Authentication    | Express sessions        |
| Validation        | Zod                     |
| API communication | REST API                |
| Frontend hosting  | Vercel                  |
| Backend hosting   | Render                  |
| Database hosting  | Neon PostgreSQL         |
| Version control   | Git and GitHub          |

---

## Project Structure

```text
portfolio/
│
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       │   └── admin/
│       │       └── MessagesManager.tsx
│       ├── pages/
│       │   └── AdminDashboard.tsx
│       ├── services/
│       │   ├── contactService.ts
│       │   ├── journeyService.ts
│       │   └── messageService.ts
│       └── types/
│
├── server/
│   ├── migrations/
│   └── src/
│       ├── config/
│       ├── middleware/
│       ├── routes/
│       ├── validators/
│       └── index.ts
│
├── public/
├── eslint.config.js
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- PostgreSQL
- Git

### 1. Clone the repository

```bash
git clone https://github.com/SamuelOluyemi/portfolio.git
```

Navigate into the project:

```bash
cd portfolio
```

### 2. Install dependencies

Install the frontend and backend dependencies:

```bash
cd client
npm install
```

Then:

```bash
cd ../server
npm install
```

### 3. Configure environment variables

Create the appropriate `.env` files in the frontend and backend directories.

**Frontend (`client/.env`):**

```env
VITE_API_URL=/api
```

**Backend (`server/.env`):**

Configure the PostgreSQL connection string, session secret, administrator credentials, and allowed frontend origin.

The administrator credentials use:

```env
ADMIN_EMAIL=your-admin-email
ADMIN_PASSWORD=your-secure-password
```

Use the exact database and session variable names expected by `server/src/config/database.ts` and `server/src/config/session.ts`.

Do not commit `.env` files or expose database credentials, session secrets, or administrator passwords.

### 4. Set up the database

Create a PostgreSQL database and configure the backend to connect to it.

The database migrations are located in:

```text
server/migrations/
```

Run the migrations in their intended order to create the required portfolio tables and administrator data.

For production, the application uses Neon PostgreSQL.

### 5. Start the application

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend in another terminal:

```bash
cd client
npm run dev
```

The Vite development server typically runs at:

```text
http://localhost:5173
```

The Express API runs at:

```text
http://localhost:3001
```

---

## API Overview

The backend exposes REST API endpoints for portfolio content and administrative operations.

| Endpoint                  | Method | Description                 |
| ------------------------- | ------ | --------------------------- |
| `/api/health`             | GET    | API health check            |
| `/api/projects`           | GET    | Retrieve projects           |
| `/api/projects`           | POST   | Create a project            |
| `/api/projects/:id`       | PUT    | Update a project            |
| `/api/projects/:id`       | DELETE | Delete a project            |
| `/api/journey`            | GET    | Retrieve journey milestones |
| `/api/journey`            | POST   | Create a milestone          |
| `/api/journey/:id`        | PUT    | Update a milestone          |
| `/api/journey/:id`        | DELETE | Delete a milestone          |
| `/api/contact`            | POST   | Submit a contact message    |
| `/api/contact`            | GET    | Retrieve messages           |
| `/api/contact/:id/status` | PATCH  | Update message status       |
| `/api/contact/:id`        | DELETE | Delete a message            |
| `/api/auth/login`         | POST   | Administrator login         |

Administrative endpoints require an authenticated administrator session. Public endpoints are subject to the configured rate limits.

---

## Deployment

The application is deployed using separate frontend and backend services.

### Frontend – Vercel

- Platform: Vercel
- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`
- API configuration: `VITE_API_URL=/api`

Live URL:

https://portfolio-orcin-omega-2bzem986qs.vercel.app/

### Backend – Render

- Platform: Render
- Root directory: `server`
- Runtime: Node.js
- Database: Neon PostgreSQL

API URL:

https://portfolio-api-frh4.onrender.com/api

The backend's `CLIENT_URL` environment variable must allow the deployed frontend origin.

---

## Development and Build Checks

Run the server TypeScript checks from the project root:

```bash
npm run typecheck:server
```

Build the frontend:

```bash
npm run build
```

Both checks should pass before changes are committed and deployed.

---

## Future Improvements

Potential areas for future development include:

- Automated database backups and tested recovery procedures.
- Automated testing and continuous integration.
- Improved application monitoring and logging.
- Additional portfolio analytics.

---

## Author

**Samuel Oluyemi**

Software Developer | Full-Stack Development | Information Security and Privacy

GitHub: [SamuelOluyemi](https://github.com/SamuelOluyemi)

Portfolio: [View Website](https://samueloluyemi.vercel.app/)

---

## License

This project is maintained as a personal portfolio. Please contact the author before reusing substantial portions of the code or content.
