-- Slice Properties — Supabase Schema
-- Run this in the Supabase SQL editor to create all tables.

-- Clients / Prospects
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  budget_min numeric,
  budget_max numeric,
  preferred_areas text,
  status text default 'prospect',
  source text,
  created_at timestamptz default now()
);

-- Follow-up log
create table if not exists follow_ups (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  note text not null,
  created_at timestamptz default now()
);

-- Pipeline deals
create table if not exists deals (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id),
  property_address text,
  stage text default 'prospect',
  appointment_at timestamptz,
  offer_amount numeric,
  sale_price numeric,
  close_date date,
  commission numeric,
  notes text,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Listings
create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  address text not null,
  price numeric,
  beds int,
  baths numeric,
  sqft int,
  status text default 'active',
  photo_url text,
  agent_name text,
  created_at timestamptz default now()
);

-- Quiz questions
create table if not exists quiz_questions (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  options jsonb not null,
  correct_index int not null,
  explanation text,
  category text
);

-- Enable Row Level Security (optional — update policies for your use case)
-- alter table clients enable row level security;
-- alter table follow_ups enable row level security;
-- alter table deals enable row level security;
-- alter table listings enable row level security;
-- alter table quiz_questions enable row level security;
