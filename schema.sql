-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create custom types
create type user_role as enum ('admin', 'receptionist', 'guest');
create type room_status as enum ('available', 'booked', 'occupied', 'maintenance');
create type booking_status as enum ('confirmed', 'checked_in', 'checked_out', 'cancelled');
create type payment_status as enum ('pending', 'paid', 'refunded', 'failed');

-- Create tables
create table public.rooms (
    id uuid primary key default uuid_generate_v4(),
    room_number text unique not null,
    type text not null,
    status room_status default 'available',
    price decimal not null,
    floor integer not null,
    capacity integer not null,
    amenities jsonb default '{}',
    created_at timestamp with time zone default timezone('utc'::text, now()),
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

create table public.guests (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users,
    first_name text not null,
    last_name text not null,
    phone text,
    address text,
    document_type text,
    document_number text,
    preferences jsonb default '{}',
    created_at timestamp with time zone default timezone('utc'::text, now()),
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

create table public.bookings (
    id uuid primary key default uuid_generate_v4(),
    room_id uuid references public.rooms,
    guest_id uuid references public.guests,
    check_in timestamp with time zone not null,
    check_out timestamp with time zone not null,
    status booking_status default 'confirmed',
    total_amount decimal not null,
    payment_status payment_status default 'pending',
    special_requests text,
    created_at timestamp with time zone default timezone('utc'::text, now()),
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

create table public.conference_rooms (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    capacity integer not null,
    price_per_hour decimal not null,
    amenities jsonb default '{}',
    status room_status default 'available',
    created_at timestamp with time zone default timezone('utc'::text, now()),
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

create table public.restaurant_tables (
    id uuid primary key default uuid_generate_v4(),
    table_number integer unique not null,
    capacity integer not null,
    status room_status default 'available',
    created_at timestamp with time zone default timezone('utc'::text, now()),
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create indexes for better query performance
create index rooms_status_idx on public.rooms(status);
create index bookings_status_idx on public.bookings(status);
create index bookings_dates_idx on public.bookings(check_in, check_out);
create index guest_user_id_idx on public.guests(user_id);

-- Enable Row Level Security
alter table public.rooms enable row level security;
alter table public.guests enable row level security;
alter table public.bookings enable row level security;
alter table public.conference_rooms enable row level security;
alter table public.restaurant_tables enable row level security;

-- Create RLS Policies

-- Rooms policies
create policy "Rooms are viewable by everyone"
    on public.rooms for select
    using (true);

create policy "Rooms are editable by admin"
    on public.rooms for all
    using (auth.jwt() ->> 'role' = 'admin');

-- Guests policies
create policy "Guests can view own profile"
    on public.guests for select
    using (auth.uid() = user_id);

create policy "Admin can view all guests"
    on public.guests for select
    using (auth.jwt() ->> 'role' = 'admin');

create policy "Guests can update own profile"
    on public.guests for update
    using (auth.uid() = user_id);

-- Bookings policies
create policy "Users can view own bookings"
    on public.bookings for select
    using (auth.uid() in (
        select user_id from public.guests where id = guest_id
    ));

create policy "Admin can view all bookings"
    on public.bookings for select
    using (auth.jwt() ->> 'role' = 'admin');

-- Functions for automatic updates
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger handle_rooms_updated_at
    before update on public.rooms
    for each row
    execute function public.handle_updated_at();

create trigger handle_guests_updated_at
    before update on public.guests
    for each row
    execute function public.handle_updated_at();

create trigger handle_bookings_updated_at
    before update on public.bookings
    for each row
    execute function public.handle_updated_at(); 