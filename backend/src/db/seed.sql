-- =============================================
-- SEED DATA FOR TRELLO CLONE
-- Run AFTER schema.sql
-- =============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- MEMBERS (Single default user)
-- =============================================
INSERT INTO members (id, name, email, avatar_url, avatar_color) VALUES
  ('a0000001-0000-0000-0000-000000000001', 'Alex Johnson', 'alex@trelloclone.dev', NULL, '#026AA7')
ON CONFLICT DO NOTHING;

-- =============================================
-- BOARD
-- =============================================
INSERT INTO boards (id, title, background_color) VALUES
  ('b0000001-0000-0000-0000-000000000001', 'Product Launch Q2', '#0052CC')
ON CONFLICT DO NOTHING;

-- Board Members
INSERT INTO board_members (board_id, member_id) VALUES
  ('b0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;

-- =============================================
-- LABELS
-- =============================================
INSERT INTO labels (id, board_id, name, color) VALUES
  ('c0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', 'Bug', '#EB5A46'),
  ('c0000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000001', 'Feature', '#61BD4F'),
  ('c0000001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000001', 'Design', '#C377E0'),
  ('c0000001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000001', 'Research', '#F2D600'),
  ('c0000001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000001', 'High Priority', '#FF9F1A'),
  ('c0000001-0000-0000-0000-000000000006', 'b0000001-0000-0000-0000-000000000001', 'Backend', '#0079BF')
ON CONFLICT DO NOTHING;

-- =============================================
-- LISTS
-- =============================================
INSERT INTO lists (id, board_id, title, position) VALUES
  ('d0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', 'Backlog', 1000),
  ('d0000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000001', 'In Progress', 2000),
  ('d0000001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000001', 'In Review', 3000),
  ('d0000001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000001', 'Done', 4000)
ON CONFLICT DO NOTHING;

-- =============================================
-- CARDS
-- =============================================
INSERT INTO cards (id, list_id, title, description, position, due_date) VALUES
  -- Backlog
  ('e0000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001', 'User authentication flow', 'Design and implement the complete user sign-up and login experience including OAuth support.', 1000, NOW() + INTERVAL '7 days'),
  ('e0000001-0000-0000-0000-000000000002', 'd0000001-0000-0000-0000-000000000001', 'Notification system', 'Build email and in-app notification service for board activity updates.', 2000, NULL),
  ('e0000001-0000-0000-0000-000000000003', 'd0000001-0000-0000-0000-000000000001', 'Mobile responsive layout', 'Ensure the board view works well on mobile and tablet devices.', 3000, NOW() + INTERVAL '14 days'),
  -- In Progress
  ('e0000001-0000-0000-0000-000000000004', 'd0000001-0000-0000-0000-000000000002', 'Drag & drop for cards', 'Implement smooth drag-and-drop reordering of cards within and across lists using @dnd-kit.', 1000, NOW() + INTERVAL '2 days'),
  ('e0000001-0000-0000-0000-000000000005', 'd0000001-0000-0000-0000-000000000002', 'Card detail modal', 'Build the card detail view with labels, checklist, due date, members, and activity log sections.', 2000, NOW() + INTERVAL '3 days'),
  ('e0000001-0000-0000-0000-000000000006', 'd0000001-0000-0000-0000-000000000002', 'Board background picker', 'Allow users to customize board background with solid colors or gradient options.', 3000, NULL),
  -- In Review
  ('e0000001-0000-0000-0000-000000000007', 'd0000001-0000-0000-0000-000000000003', 'REST API endpoints', 'All CRUD endpoints for boards, lists, cards, labels, checklists, and members.', 1000, NOW() - INTERVAL '1 day'),
  ('e0000001-0000-0000-0000-000000000008', 'd0000001-0000-0000-0000-000000000003', 'Database schema design', 'Design and finalize the PostgreSQL schema with proper relationships and indexes.', 2000, NOW() - INTERVAL '2 days'),
  -- Done
  ('e0000001-0000-0000-0000-000000000009', 'd0000001-0000-0000-0000-000000000004', 'Project setup', 'Initialize Next.js frontend and Express backend projects with TypeScript.', 1000, NULL),
  ('e0000001-0000-0000-0000-000000000010', 'd0000001-0000-0000-0000-000000000004', 'Neon DB setup', 'Create Neon project, configure connection pooling, and deploy initial schema.', 2000, NULL)
ON CONFLICT DO NOTHING;

-- =============================================
-- CARD LABELS
-- =============================================
INSERT INTO card_labels (card_id, label_id) VALUES
  ('e0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000002'),
  ('e0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000005'),
  ('e0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002'),
  ('e0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000006'),
  ('e0000001-0000-0000-0000-000000000003', 'c0000001-0000-0000-0000-000000000003'),
  ('e0000001-0000-0000-0000-000000000004', 'c0000001-0000-0000-0000-000000000002'),
  ('e0000001-0000-0000-0000-000000000004', 'c0000001-0000-0000-0000-000000000005'),
  ('e0000001-0000-0000-0000-000000000005', 'c0000001-0000-0000-0000-000000000003'),
  ('e0000001-0000-0000-0000-000000000006', 'c0000001-0000-0000-0000-000000000003'),
  ('e0000001-0000-0000-0000-000000000007', 'c0000001-0000-0000-0000-000000000006'),
  ('e0000001-0000-0000-0000-000000000008', 'c0000001-0000-0000-0000-000000000006'),
  ('e0000001-0000-0000-0000-000000000008', 'c0000001-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;

-- =============================================
-- CARD MEMBERS
-- =============================================
INSERT INTO card_members (card_id, member_id) VALUES
  ('e0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001'),
  ('e0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000001'),
  ('e0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000001'),
  ('e0000001-0000-0000-0000-000000000004', 'a0000001-0000-0000-0000-000000000001'),
  ('e0000001-0000-0000-0000-000000000005', 'a0000001-0000-0000-0000-000000000001'),
  ('e0000001-0000-0000-0000-000000000007', 'a0000001-0000-0000-0000-000000000001'),
  ('e0000001-0000-0000-0000-000000000008', 'a0000001-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;

-- =============================================
-- CHECKLISTS
-- =============================================
INSERT INTO checklists (id, card_id, title, position) VALUES
  ('f0000001-0000-0000-0000-000000000001', 'e0000001-0000-0000-0000-000000000004', 'Implementation Steps', 1000),
  ('f0000001-0000-0000-0000-000000000002', 'e0000001-0000-0000-0000-000000000005', 'UI Components', 1000)
ON CONFLICT DO NOTHING;

INSERT INTO checklist_items (id, checklist_id, title, is_completed, position) VALUES
  ('a1000001-0000-0000-0000-000000000001', 'f0000001-0000-0000-0000-000000000001', 'Install @dnd-kit/core and @dnd-kit/sortable', TRUE, 1000),
  ('a1000001-0000-0000-0000-000000000002', 'f0000001-0000-0000-0000-000000000001', 'Set up DndContext with sensors', TRUE, 2000),
  ('a1000001-0000-0000-0000-000000000003', 'f0000001-0000-0000-0000-000000000001', 'Implement SortableCard component', FALSE, 3000),
  ('a1000001-0000-0000-0000-000000000004', 'f0000001-0000-0000-0000-000000000001', 'Add cross-list drag support', FALSE, 4000),
  ('a1000001-0000-0000-0000-000000000005', 'f0000001-0000-0000-0000-000000000001', 'Sync drag-end with backend API', FALSE, 5000),
  ('a1000001-0000-0000-0000-000000000006', 'f0000001-0000-0000-0000-000000000002', 'Card title & description editor', FALSE, 1000),
  ('a1000001-0000-0000-0000-000000000007', 'f0000001-0000-0000-0000-000000000002', 'Label picker popover', FALSE, 2000),
  ('a1000001-0000-0000-0000-000000000008', 'f0000001-0000-0000-0000-000000000002', 'Due date picker', FALSE, 3000),
  ('a1000001-0000-0000-0000-000000000009', 'f0000001-0000-0000-0000-000000000002', 'Checklist section', FALSE, 4000),
  ('a1000001-0000-0000-0000-000000000010', 'f0000001-0000-0000-0000-000000000002', 'Member assignment popover', FALSE, 5000)
ON CONFLICT DO NOTHING;

-- =============================================
-- ACTIVITIES (Sample log)
-- =============================================
INSERT INTO activities (card_id, member_id, action_type, description) VALUES
  ('e0000001-0000-0000-0000-000000000004', 'a0000001-0000-0000-0000-000000000001', 'card_created', 'Alex Johnson created this card'),
  ('e0000001-0000-0000-0000-000000000005', 'a0000001-0000-0000-0000-000000000001', 'card_created', 'Alex Johnson created this card'),
  ('e0000001-0000-0000-0000-000000000007', 'a0000001-0000-0000-0000-000000000001', 'card_moved', 'Alex Johnson moved this card from In Progress to In Review')
ON CONFLICT DO NOTHING;
