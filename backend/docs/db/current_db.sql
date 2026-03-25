CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE public.users (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    username VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    password_hash VARCHAR NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email)
);

CREATE TABLE public.tasks (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title VARCHAR NOT NULL,
    description text,
    due_date date,
    priority VARCHAR NOT NULL DEFAULT 'medium' CHECK (priority in ('low', 'medium', 'high')),
    status VARCHAR NOT NULL DEFAULT 'todo' CHECK (status in ('todo', 'in-progress', 'done')),
    subject VARCHAR,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT tasks_pkey PRIMARY KEY (id),
    CONSTRAINT tasks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);