/**
 * Centralized API client for all backend communication.
 * 
 * Each function maps directly to a backend REST endpoint.
 * All functions return the unwrapped `data` field from the
 * `{ success, data }` response envelope.
 */

import axios from 'axios';
import type {
  ApiResponse,
  Board,
  BoardDetail,
  Card,
  CardDetail,
  Checklist,
  ChecklistItem,
  Label,
  Member,
} from './types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// ─── Boards ─────────────────────────────────────────────────────────────────

export async function getBoards(): Promise<Board[]> {
  const { data } = await api.get<ApiResponse<Board[]>>('/boards');
  return data.data;
}

export async function getBoardById(boardId: string): Promise<BoardDetail> {
  const { data } = await api.get<ApiResponse<BoardDetail>>(`/boards/${boardId}`);
  return data.data;
}

export async function createBoard(title: string, background_color?: string): Promise<Board> {
  const { data } = await api.post<ApiResponse<Board>>('/boards', {
    title,
    background_color,
  });
  return data.data;
}

export async function updateBoard(
  boardId: string,
  updates: { title?: string; background_color?: string; background_image?: string }
): Promise<Board> {
  const { data } = await api.put<ApiResponse<Board>>(`/boards/${boardId}`, updates);
  return data.data;
}

export async function deleteBoard(boardId: string): Promise<void> {
  await api.delete(`/boards/${boardId}`);
}

export async function getArchivedCards(boardId: string): Promise<Card[]> {
  const { data } = await api.get<ApiResponse<Card[]>>(`/boards/${boardId}/archived-cards`);
  return data.data;
}

// ─── Lists ──────────────────────────────────────────────────────────────────

export async function createList(boardId: string, title: string) {
  const { data } = await api.post<ApiResponse<unknown>>(`/boards/${boardId}/lists`, { title });
  return data.data;
}

export async function updateList(listId: string, title: string) {
  const { data } = await api.put<ApiResponse<unknown>>(`/lists/${listId}`, { title });
  return data.data;
}

export async function deleteList(listId: string): Promise<void> {
  await api.delete(`/lists/${listId}`);
}

export async function reorderLists(updates: Array<{ id: string; position: number }>) {
  await api.put('/lists/reorder', { updates });
}

// ─── Cards ──────────────────────────────────────────────────────────────────

export async function createCard(listId: string, title: string): Promise<Card> {
  const { data } = await api.post<ApiResponse<Card>>(`/lists/${listId}/cards`, { title });
  return data.data;
}

export async function getCardById(cardId: string): Promise<CardDetail> {
  const { data } = await api.get<ApiResponse<CardDetail>>(`/cards/${cardId}`);
  return data.data;
}

export async function updateCard(
  cardId: string,
  updates: {
    title?: string;
    description?: string | null;
    due_date?: string | null;
    cover_color?: string | null;
    cover_image?: string | null;
    is_archived?: boolean;
  }
): Promise<Card> {
  const { data } = await api.put<ApiResponse<Card>>(`/cards/${cardId}`, updates);
  return data.data;
}

export async function deleteCard(cardId: string): Promise<void> {
  await api.delete(`/cards/${cardId}`);
}

export async function reorderCards(
  updates: Array<{ id: string; position: number; list_id: string }>
) {
  await api.put('/cards/reorder', { updates });
}

// ─── Labels ─────────────────────────────────────────────────────────────────

export async function getBoardLabels(boardId: string): Promise<Label[]> {
  const { data } = await api.get<ApiResponse<Label[]>>(`/boards/${boardId}/labels`);
  return data.data;
}

export async function createLabel(
  boardId: string,
  label: { name?: string; color: string }
): Promise<Label> {
  const { data } = await api.post<ApiResponse<Label>>(`/boards/${boardId}/labels`, label);
  return data.data;
}

export async function updateLabel(
  labelId: string,
  updates: { name?: string; color: string }
): Promise<Label> {
  const { data } = await api.put<ApiResponse<Label>>(`/labels/${labelId}`, updates);
  return data.data;
}

export async function deleteLabel(labelId: string): Promise<void> {
  await api.delete(`/labels/${labelId}`);
}

export async function addLabelToCard(cardId: string, labelId: string): Promise<void> {
  await api.post(`/cards/${cardId}/labels/${labelId}`);
}

export async function removeLabelFromCard(cardId: string, labelId: string): Promise<void> {
  await api.delete(`/cards/${cardId}/labels/${labelId}`);
}

// ─── Members ────────────────────────────────────────────────────────────────

export async function getMembers(): Promise<Member[]> {
  const { data } = await api.get<ApiResponse<Member[]>>('/members');
  return data.data;
}

export async function addMemberToCard(cardId: string, memberId: string): Promise<void> {
  await api.post(`/cards/${cardId}/members/${memberId}`);
}

export async function removeMemberFromCard(cardId: string, memberId: string): Promise<void> {
  await api.delete(`/cards/${cardId}/members/${memberId}`);
}

// ─── Checklists ─────────────────────────────────────────────────────────────

export async function createChecklist(
  cardId: string,
  title?: string
): Promise<Checklist> {
  const { data } = await api.post<ApiResponse<Checklist>>(`/cards/${cardId}/checklists`, {
    title,
  });
  return data.data;
}

export async function updateChecklist(
  checklistId: string,
  title: string
): Promise<Checklist> {
  const { data } = await api.put<ApiResponse<Checklist>>(`/checklists/${checklistId}`, {
    title,
  });
  return data.data;
}

export async function deleteChecklist(checklistId: string): Promise<void> {
  await api.delete(`/checklists/${checklistId}`);
}

export async function createChecklistItem(
  checklistId: string,
  title: string
): Promise<ChecklistItem> {
  const { data } = await api.post<ApiResponse<ChecklistItem>>(
    `/checklists/${checklistId}/items`,
    { title }
  );
  return data.data;
}

export async function updateChecklistItem(
  itemId: string,
  updates: { title?: string; is_completed?: boolean }
): Promise<ChecklistItem> {
  const { data } = await api.put<ApiResponse<ChecklistItem>>(
    `/checklist-items/${itemId}`,
    updates
  );
  return data.data;
}

export async function deleteChecklistItem(itemId: string): Promise<void> {
  await api.delete(`/checklist-items/${itemId}`);
}

// ─── Search & Filter ────────────────────────────────────────────────────────

export async function searchCards(
  boardId: string,
  params: {
    q?: string;
    labels?: string[];
    members?: string[];
    dueDate?: 'overdue' | 'due_soon' | 'no_due_date';
  }
): Promise<Card[]> {
  const searchParams = new URLSearchParams();
  if (params.q) searchParams.set('q', params.q);
  if (params.labels?.length) searchParams.set('labels', params.labels.join(','));
  if (params.members?.length) searchParams.set('members', params.members.join(','));
  if (params.dueDate) searchParams.set('dueDate', params.dueDate);

  const { data } = await api.get<ApiResponse<Card[]>>(
    `/boards/${boardId}/search?${searchParams.toString()}`
  );
  return data.data;
}

// ─── Lists Card Create (nested under boards route) ──────────────────────────
// Note: Card creation is via POST /api/lists/:listId/cards
// which is already handled by createCard() above.
// The backend route for this is in boards.routes.ts, but the route
// resolves to /api/lists/:listId/cards through the router aggregator.

export default api;
