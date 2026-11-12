# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

# Start

## Start the dev server

```npm run dev

```

## Tech Stack

- React [component-based user interface]
- TypeScript [type safety, interfaces, and maintainable code]
- Tailwind CSS [utility-first styling and responsive design]
- Node.js + Express [backend API and server-side functionality]
- PostgreSQL [database for projects, messages and content]
- Git + GitHub [version control and source code management]
- Vercel + backend hosting [public deploymeny and always-available services]

## App Structure

Full-stack development, API design, database integration, authentication and security practices.

- FRONTEND - React + TypeScript + Tailwind CSS (What visitors see and itneract with)
- through HTTP/ REST API
- BACKEND - Node.js + Express + TypeScript (Business logic, validation, authentication and API endpoints)
- DATABASE - PostgreSQL (Persistent application data)

### BACKEND

Projects API: Retrieve my projects dynamically.
Contact API: Allow visitors to send me messages.
Journey API: Retrieve my learning milestones and achievements.
Admin authentication: Allow me to sign in and manage my portfolio content.
Security: Input validation, rate limiting, secure authentication, and appropriate security headers.

We will implement the authentication when we introduce the admin dashboard.

### Project Structure

- portfolio/
  - client/ #React FRONTEND
    - src/
      - components/
      - pages/
      - sections/
      - services/
      - types/
      - App.tsx
      - main.tsx
    - .env.example
    - index.html
    - packages.json
    - tsconfig.json
    - vite.config.ts

  - server/ #Express BACKEND
    - src/
      - routes/
      - controllers/
      - middleware/
      - servcies/
      - config/
      - index.ts
    - .env.example
    - package.json
    - tsconfig.json

  - .gitignore
  - package.json #root scripts
  - package-lock.json # root dependencies
  - README.md

### Architectural Decision

Our first release will have:

- A complete React + TypeScript + Tailwind frontend.
- A functioning Express API.
- Projects retrieved through the API.
- A working contact endpoint (we'll connect persistent storage and email delivery next).
- A live deployment.

Then we'll introduce PostgreSQL and an admin dashboard.

### Implementation direction

We implement:

- React components and hooks.
- TypeScript types, interfaces and generics.
- Tailwind responsive styling.
- REST API development.
- Express middleware.
- PostgreSQL and database design.
- Authentication and application security.
- Git branching and version control.
- Deployment and environment variables.

## What we do next

We'll continue in small, testable steps, just as we've been doing:

1. Finish committing and pushing the debugging cleanup.
2. Review the existing backend before changing anything.
3. Introduce PostgreSQL and connect it to the backend.
4. Move project data into the database.
5. Build the Journey API.
6. Build the Contact API, including validation and spam protection.
7. Strengthen backend security.
8. Build the admin dashboard and authentication.
9. Complete production deployment and testing.
