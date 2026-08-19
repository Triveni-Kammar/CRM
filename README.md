# Trishul CRM — Smart Business Management

A role-based CRM built for the Trishul CRM Development Challenge brief: cinematic
opening sequence, Admin/Supervisor/User access levels, animated dashboard,
Customers/Leads/Tasks/Employees modules, exportable reports, and a data-grounded
AI Assistant.

## Stack

- **React 19 + Vite** — app shell and build tooling
- **Tailwind CSS v4** — styling (dark cinematic theme, gold/ember accent)
- **Framer Motion** — opening cinematic sequence, page transitions, micro-interactions
- **Recharts** — dashboard and report charts
- **React Router** — routing + role-based route protection
- **lucide-react** — icon set
- **Browser localStorage** — persistence layer (see "Data & backend" below)

## Getting started

```bash
npm install
npm run dev       # local dev server
npm run build     # production build -> dist/
npm run preview   # preview the production build
```

## Demo login

There's no real backend, so login is a role picker (matches the brief's
role-based access requirement):

| Role | Access |
|---|---|
| **Admin** | Full access — Employees, Reports, AI Assistant, Settings |
| **Supervisor** | Customers, Leads, Tasks, Reports; manages assigned users |
| **User** | Only their own assigned Leads and Tasks |

Password field is decorative in this demo (any value works).

## Beyond the brief

A few extras added on top of the PRD, meant to show initiative in a walk-in
interview setting:

- **Advanced opening animation** — expanded from a simple drop-and-flash into
  a fuller 12-beat sequence: layered starfield, motion-trail afterimages on the
  trident's descent, jagged animated lightning bolts, camera shake on impact,
  hand-drawn SVG ground cracks, mixed-shape debris + dust particles, dual
  shockwave rings, a boot-log ticker ("Forging secure session…"), and a
  progress bar — before morphing into a UI grid and the login screen.
- **Command palette (Ctrl/Cmd+K)** — jump to any page, customer, lead, or task
  from anywhere, respecting the current role's permissions. The topbar search
  box opens it too.
- **Toast notifications with undo** — every add/edit/delete across Customers,
  Leads, Tasks, and Employees gets a toast; deletes include a 4-second Undo.
- **Functional light/dark theme toggle** — a real toggle (topbar icon + Settings
  dropdown) that swaps the full color system via CSS variables, not just a
  decorative select box.
- **Lead → Customer conversion** — a "Convert to Customer" action appears on
  Won leads, creating a linked customer record and logging it to that
  customer's activity timeline.
- **Customer activity timeline** — clicking a customer row opens a detail
  drawer showing a chronological log of what's happened to that record
  (created, edited, converted from a lead).

## What's implemented against the brief

- **Opening animation (mandatory)** — `src/components/OpeningAnimation.jsx`: dark
  particle field → trident descends → impact shockwave → shatter/energy wave →
  screen flash → transition into login. Runs once per browser session
  (`sessionStorage`), with a "skip intro" control and `prefers-reduced-motion`
  support.
- **Role-based access** — `src/utils/permissions.js` + `ProtectedRoute` gate every
  route and nav item by role.
- **Dashboard** — stat cards, monthly leads line chart, customer growth bar chart,
  latest customers / new leads lists.
- **Customers / Leads / Tasks** — full CRUD with modals, search & status filters,
  a kanban-style leads board, and task completion toggling.
- **Employees (Admin only)** — CRUD with supervisor assignment.
- **Reports** — leads-by-status pie chart, task-completion chart, CSV export
  (customers & leads) and a print-to-PDF export.
- **AI Assistant (Admin only)** — chat UI that answers the brief's example
  prompts ("Summarize today's activity", "List inactive customers", "Show the
  top-performing employee", etc.) using **your live CRM data**, not canned text.
- **Settings** — company name, theme selector, account fields, demo data reset.
- **Animations** — Framer Motion page transitions, hover states, loading
  indicators, dashboard counters, sidebar/topbar interactions.
- **Responsive** — mobile drawer sidebar, responsive grids down to phone width.

## Data & backend

There's no server in this build — all CRM data (customers, leads, tasks,
employees) is seeded from `src/data/seed.js` and persisted to the browser's
`localStorage` via `src/context/DataContext.jsx`, so changes survive a refresh
but are local to your browser. This keeps the project runnable with zero setup
for the walk-in interview / demo.

To make it production-real, swap `DataContext`'s local read/writes for calls to
a real API (Node/Express + MongoDB matches the brief's "Database Collections"
list: Users, Customers, Leads, Tasks, Reports, Settings) — the CRUD function
signatures are already shaped like typical REST calls, so the page components
won't need to change.

## Wiring up a real AI Assistant

`src/pages/AIAssistant.jsx` currently answers with a rule-based `respond()`
function grounded in live CRM data — it's deliberately not a browser-side call
to a paid LLM API (that would leak your API key). To go live:

1. Add a small backend route, e.g. `POST /api/assistant`, that calls the
   Anthropic Messages API (or your provider of choice) server-side.
2. Pass it the user's prompt plus a compact summary of current CRM data as
   context.
3. Replace the `respond(prompt, data)` call in `AIAssistant.jsx` with a
   `fetch('/api/assistant', ...)` call.

## Project structure

```
src/
  components/   Sidebar, Topbar, Layout, Login, OpeningAnimation, shared ui.jsx
  context/      AuthContext (role/session), DataContext (CRUD + persistence)
  data/         seed.js — demo users, customers, leads, tasks, employees
  pages/        Dashboard, Customers, Leads, Tasks, Employees, Reports,
                AIAssistant, Settings
  utils/        permissions.js — role → allowed routes
```

## Notes for submission

- Update `package.json`'s `name`/`version` and this README's team details
  before submitting.
- `npm run build` produces a static `dist/` folder deployable to Vercel,
  Netlify, GitHub Pages, or any static host for the "Live Demo Link" requirement.
- Swap the placeholder company name/logo assets under `index.html` and
  `Sidebar.jsx`/`Login.jsx` if you want to move further from the sample brand.
