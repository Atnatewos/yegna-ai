-- ============================================
-- Yegna AI - Database Migration
-- File: database/migrations/004_create_tasks.sql
-- Creates tasks and task submissions tables
-- ============================================

-- Create tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    task_type VARCHAR(20) NOT NULL CHECK (task_type IN ('text', 'image', 'file', 'voice')),
    reward_amount DECIMAL(12, 2) NOT NULL,
    required_level INT NOT NULL DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired')),
    max_completions INT DEFAULT 100,
    completion_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- Create task submissions table
CREATE TABLE task_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    submission_data JSONB NOT NULL,
    attachments JSONB DEFAULT '[]',
    status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('submitted', 'approved', 'rejected')),
    reward_amount DECIMAL(12, 2) NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    UNIQUE(task_id, user_id)
);

-- Create index on task_id for submissions
CREATE INDEX idx_task_submissions_task_id ON task_submissions(task_id);

-- Create index on user_id for submissions
CREATE INDEX idx_task_submissions_user_id ON task_submissions(user_id);

-- Create index on status for submissions
CREATE INDEX idx_task_submissions_status ON task_submissions(status);

-- Create index on task status
CREATE INDEX idx_tasks_status ON tasks(status);

-- Create index on task type
CREATE INDEX idx_tasks_type ON tasks(task_type);