create table if not exists public.clothing_items (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  nome text not null,
  loja text not null,
  categoria text not null,
  imagem text not null,
  preco numeric(10,2) not null default 0,
  link text not null,
  created_at timestamptz not null default now()
);

alter table public.clothing_items enable row level security;

create policy "Allow read own items"
on public.clothing_items
for select
using (auth.uid()::text = user_id);

create policy "Allow insert own items"
on public.clothing_items
for insert
with check (auth.uid()::text = user_id);

