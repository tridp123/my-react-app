---
name: Frontend Skill
description: Guide for setting up and developing frontend components in the React application.
---

# Frontend Skill

## Overview
This skill provides a step‑by‑step guide for developers working on the frontend of the **my‑react‑app** project. It covers environment setup, project structure, component creation, styling conventions, and common development workflows.

## Prerequisites
- Node.js (v20 or later) installed.
- npm (comes with Node) or Yarn.
- Basic familiarity with React, JavaScript/TypeScript, and modern CSS.

## 1. Project Setup
1. **Clone the repository** (if not already done):
   ```bash
   git clone https://github.com/tridp123/my-react-app.git
   cd my-react-app
   ```
2. **Install dependencies**:
   ```bash
   npm install
   # or yarn install
   ```
3. **Start the development server**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## 2. Directory Layout
```
my-react-app/
├─ public/                # Static assets (favicon, index.html)
├─ src/
│  ├─ assets/            # Images, icons, fonts
│  ├─ components/        # Reusable UI components
│  │   ├─ Button/
│  │   │   ├─ Button.jsx
│  │   │   └─ Button.css
│  │   └─ ...
│  ├─ pages/             # Top‑level page components (Home, About, etc.)
│  ├─ styles/            # Global CSS, design tokens, theme
│  ├─ utils/             # Helper functions, hooks
│  └─ index.js           # Application entry point
└─ package.json
```

## 3. Component Creation Guidelines
- **File Naming**: Use `PascalCase` for component folders and files (e.g., `Header/Header.jsx`).
- **Styling**: Prefer **CSS Modules** or **Vanilla CSS** scoped to the component folder. Avoid global selectors.
- **Export**: Export the component as a default export.
- **Prop Types**: If using JavaScript, add `prop-types`. If using TypeScript, define an interface for props.
- **Accessibility**: Include appropriate ARIA attributes and semantic HTML.

### Example: Creating a Card Component
```bash
mkdir -p src/components/Card
```
Create `src/components/Card/Card.jsx`:
```jsx
import React from "react";
import "./Card.css";

export default function Card({ title, children }) {
  return (
    <div className="card">
      <h2 className="card-title">{title}</h2>
      <div className="card-body">{children}</div>
    </div>
  );
}
```
Create `src/components/Card/Card.css`:
```css
.card {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;
}
.card:hover {
  transform: translateY(-4px);
}
.card-title {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  color: #fff;
}
```

## 4. Styling Conventions
- **Color Palette**: Define HSL variables in `src/styles/theme.css`.
- **Typography**: Use Google Font **Inter** – import in `index.html`.
- **Dark Mode**: Add a `.dark` class on the `<html>` element and use CSS custom properties for light/dark values.
- **Micro‑animations**: Use `transition` for hover/focus states; keep animations under 300 ms.

## 5. Common Development Workflows
| Task | Command |
|------|---------|
| Run dev server | `npm run dev` |
| Lint & fix | `npm run lint -- --fix` |
| Build production | `npm run build` |
| Run tests | `npm test` |

### Hot‑Reloading
The dev server supports hot‑module replacement. Save any file and the browser updates automatically.

## 6. Testing Guidelines
- Use **Jest** and **React Testing Library**.
- Write tests alongside components in a `__tests__` folder or as `Component.test.jsx`.
- Aim for at least 80 % coverage on UI logic.

## 7. Deployment Checklist
1. Run `npm run build` and verify the `dist/` folder.
2. Ensure all environment variables are set for production.
3. Deploy to your preferred static host (Vercel, Netlify, etc.).

---
*This skill file can be referenced by other agents or used as documentation for onboarding new frontend contributors.*
