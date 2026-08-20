-- Migration: 0002_voice_sessions_production.sql
-- Description: Creates voice_sessions table with complete lifecycle, auditing, structured transcripts, and indexes for production.

CREATE TABLE IF NOT EXISTS voice_sessions (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    conversation_id INTEGER REFERENCES conversations(id) ON DELETE SET NULL,
    contact_id INTEGER REFERENCES contacts(id) ON DELETE SET NULL,
    channel_id INTEGER REFERENCES channels(id) ON DELETE SET NULL,
    agent_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    session_id VARCHAR(100) NOT NULL UNIQUE,
    provider_call_id VARCHAR(255),
    status VARCHAR(30) DEFAULT 'initiated' NOT NULL,
    direction VARCHAR(10) DEFAULT 'inbound' NOT NULL,
    caller_number VARCHAR(50),
    callee_number VARCHAR(50),
    provider VARCHAR(50) DEFAULT 'mock' NOT NULL,
    duration_seconds INTEGER DEFAULT 0,
    transcript TEXT,
    transcript_json TEXT,
    summary TEXT,
    metadata TEXT,
    error_reason TEXT,
    started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    answered_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Idempotent column additions in case table already existed from earlier iteration
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='voice_sessions' AND column_name='agent_id') THEN
        ALTER TABLE voice_sessions ADD COLUMN agent_id INTEGER REFERENCES users(id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='voice_sessions' AND column_name='provider_call_id') THEN
        ALTER TABLE voice_sessions ADD COLUMN provider_call_id VARCHAR(255);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='voice_sessions' AND column_name='answered_at') THEN
        ALTER TABLE voice_sessions ADD COLUMN answered_at TIMESTAMPTZ;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='voice_sessions' AND column_name='transcript_json') THEN
        ALTER TABLE voice_sessions ADD COLUMN transcript_json TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='voice_sessions' AND column_name='error_reason') THEN
        ALTER TABLE voice_sessions ADD COLUMN error_reason TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='voice_sessions' AND column_name='updated_at') THEN
        ALTER TABLE voice_sessions ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL;
    END IF;
END $$;

-- High-performance production indexes
CREATE INDEX IF NOT EXISTS idx_voice_sessions_org ON voice_sessions (organization_id);
CREATE INDEX IF NOT EXISTS idx_voice_sessions_session_id ON voice_sessions (session_id);
CREATE INDEX IF NOT EXISTS idx_voice_sessions_conv ON voice_sessions (conversation_id);
CREATE INDEX IF NOT EXISTS idx_voice_sessions_contact ON voice_sessions (contact_id);
CREATE INDEX IF NOT EXISTS idx_voice_sessions_status ON voice_sessions (status);
CREATE INDEX IF NOT EXISTS idx_voice_sessions_created ON voice_sessions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_voice_sessions_caller ON voice_sessions (caller_number);
CREATE INDEX IF NOT EXISTS idx_voice_sessions_callee ON voice_sessions (callee_number);
