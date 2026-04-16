import pool from '../config/database';
import { ApiError } from '../utils/ApiError';

export const createChecklist = async (cardId: string, title: string) => {
  const posResult = await pool.query(
    'SELECT MAX(position) AS max_pos FROM checklists WHERE card_id = $1',
    [cardId]
  );
  const maxPos = (posResult.rows[0]?.max_pos as number | null) ?? 0;

  const result = await pool.query(
    'INSERT INTO checklists (card_id, title, position) VALUES ($1, $2, $3) RETURNING *',
    [cardId, title, maxPos + 1000]
  );
  return { ...result.rows[0], items: [] };
};

export const updateChecklist = async (checklistId: string, title: string) => {
  const result = await pool.query(
    'UPDATE checklists SET title = $1 WHERE id = $2 RETURNING *',
    [title, checklistId]
  );
  if (result.rows.length === 0) throw ApiError.notFound('Checklist not found');
  return result.rows[0];
};

export const deleteChecklist = async (checklistId: string) => {
  const result = await pool.query(
    'DELETE FROM checklists WHERE id = $1 RETURNING id',
    [checklistId]
  );
  if (result.rows.length === 0) throw ApiError.notFound('Checklist not found');
};

export const createChecklistItem = async (checklistId: string, title: string) => {
  const posResult = await pool.query(
    'SELECT MAX(position) AS max_pos FROM checklist_items WHERE checklist_id = $1',
    [checklistId]
  );
  const maxPos = (posResult.rows[0]?.max_pos as number | null) ?? 0;

  const result = await pool.query(
    'INSERT INTO checklist_items (checklist_id, title, position) VALUES ($1, $2, $3) RETURNING *',
    [checklistId, title, maxPos + 1000]
  );
  return result.rows[0];
};

export const updateChecklistItem = async (
  itemId: string,
  data: { title?: string; is_completed?: boolean }
) => {
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (data.title !== undefined) { fields.push(`title = $${idx++}`); values.push(data.title); }
  if (data.is_completed !== undefined) { fields.push(`is_completed = $${idx++}`); values.push(data.is_completed); }

  if (fields.length === 0) throw ApiError.badRequest('No fields to update');
  values.push(itemId);

  const result = await pool.query(
    `UPDATE checklist_items SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
    values
  );
  if (result.rows.length === 0) throw ApiError.notFound('Checklist item not found');
  return result.rows[0];
};

export const deleteChecklistItem = async (itemId: string) => {
  const result = await pool.query(
    'DELETE FROM checklist_items WHERE id = $1 RETURNING id',
    [itemId]
  );
  if (result.rows.length === 0) throw ApiError.notFound('Checklist item not found');
};
