/**
 * TypeScript interfaces for all entity types.
 * These mirror the database schema defined in backend/src/db/schema.sql.
 */

// ─── Member ─────────────────────────────────────────────────────────────────
export interface Member {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  avatar_color: string;
  created_at: string;
}

// ─── Board ──────────────────────────────────────────────────────────────────
export interface Board {
  id: string;
  title: string;
  background_color: string;
  background_image: string | null;
  created_at: string;
  updated_at: string;
  /** Populated on list view (GET /api/boards) */
  list_count?: string;
  card_count?: string;
}

export interface BoardDetail extends Board {
  lists: List[];
  labels: Label[];
  members: Member[];
}

// ─── List ───────────────────────────────────────────────────────────────────
export interface List {
  id: string;
  board_id: string;
  title: string;
  position: number;
  created_at: string;
  updated_at: string;
  cards: Card[];
}

// ─── Card ───────────────────────────────────────────────────────────────────
export interface Card {
  id: string;
  list_id: string;
  title: string;
  description: string | null;
  position: number;
  cover_color: string | null;
  cover_image: string | null;
  due_date: string | null;
  is_archived: boolean;
  is_completed: boolean;
  created_at?: string;
  updated_at?: string;
  labels: Label[] | null;
  members: CardMember[] | null;
  checklist_progress: ChecklistProgress | null;
}

export interface ChecklistProgress {
  total: number;
  completed: number;
}

// ─── Card Detail (full detail from GET /api/cards/:id) ──────────────────────
export interface CardDetail {
  id: string;
  list_id: string;
  title: string;
  description: string | null;
  position: number;
  cover_color: string | null;
  cover_image: string | null;
  due_date: string | null;
  is_archived: boolean;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
  labels: Label[];
  members: CardMember[];
  checklists: Checklist[];
  activities: Activity[];
}

// ─── Label ──────────────────────────────────────────────────────────────────
export interface Label {
  id: string;
  board_id?: string;
  name: string;
  color: string;
}

// ─── Card Member (subset returned in card queries) ──────────────────────────
export interface CardMember {
  id: string;
  name: string;
  avatar_color: string;
  avatar_url: string | null;
  email?: string;
}

// ─── Checklist ──────────────────────────────────────────────────────────────
export interface Checklist {
  id: string;
  card_id?: string;
  title: string;
  position: number;
  items: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  checklist_id?: string;
  title: string;
  is_completed: boolean;
  position: number;
}

// ─── Activity ───────────────────────────────────────────────────────────────
export interface Activity {
  id: string;
  card_id: string;
  member_id: string;
  action_type: string;
  description: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
  member_name: string;
  avatar_color: string;
  avatar_url: string | null;
}

// ─── API Response Wrapper ───────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
