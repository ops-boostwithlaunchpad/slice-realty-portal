# Slice Properties Portal

A Next.js real estate agent portal built with Supabase, Tailwind CSS, and DM Sans/DM Serif Display fonts.

## Tech Stack

- **Next.js 16** (App Router)
- **Supabase** (PostgreSQL database)
- **Tailwind CSS v4**
- **@hello-pangea/dnd** (drag-and-drop Kanban)
- **Lucide React** (icons)
- **DM Sans + DM Serif Display** (Google Fonts)

## Features

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/` | Stats overview, recent activity, upcoming appointments, quick-add prospect |
| Pipeline | `/pipeline` | Drag-and-drop Kanban board (Prospects → Appointments → Pending → Sold) |
| Clients | `/clients` | Client table with follow-up log and status editing |
| Listings | `/listings` | Property grid with add/edit modal |
| Quiz | `/quiz` | Florida real estate license practice quiz (25 questions, 10 random per session) |

## Setup

### 1. Install dependencies

```bash
cd portal
npm install
```

### 2. Configure Supabase

Create a project at [supabase.com](https://supabase.com), then copy your **Project URL** and **anon public key** from Project Settings → API.

Update `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Run Database Schema

In the Supabase SQL editor, run `supabase/schema.sql` to create all tables.

### 4. Seed Quiz Questions

In the Supabase SQL editor, run `supabase/seed.sql` to insert 25 Florida real estate license exam questions.

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database Tables

| Table | Description |
|-------|-------------|
| `clients` | Prospects and clients with budget and contact info |
| `follow_ups` | Follow-up notes per client (append-only log) |
| `deals` | Pipeline deals linked to clients, with stage tracking |
| `listings` | Property listings with photos and agent info |
| `quiz_questions` | Multiple choice quiz questions with explanations |

## Design System

- **Primary orange:** `#E8622A`
- **Dark sidebar:** `#1A1A18`
- **Body font:** DM Sans
- **Heading font:** DM Serif Display
- **Light mode only**

## Production Build

```bash
npm run build
npm start
```
