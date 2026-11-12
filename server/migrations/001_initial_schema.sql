
-- =========================================
-- 001: Initial Portfolio Database Schema
-- =========================================

-- 1. Projects
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    technologies TEXT[] NOT NULL DEFAULT '{}',
    category VARCHAR(100) NOT NULL,
    github_url TEXT,
    live_demo_url TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Journey milestones
CREATE TABLE IF NOT EXISTS journey_milestones (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    organization VARCHAR(150) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    date_label VARCHAR(100),
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Contact messages
CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(254) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'unread'
        CHECK (status IN ('unread', 'read', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_journey_milestones_display_order
    ON journey_milestones (display_order, id);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status_created_at
    ON contact_messages (status, created_at DESC);
