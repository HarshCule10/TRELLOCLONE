import pool from '../config/database';
import { ApiError } from '../utils/ApiError';

export const createList = async (boardId: string, title: string) => {
  // Get max position for this board
  const posResult = await pool.query(
    'SELECT MAX(position) AS max_pos FROM lists WHERE board_id = $1',
    [boardId]
  );
  const maxPos = (posResult.rows[0]?.max_pos as number | null) ?? 0;
  const newPosition = maxPos + 1000;

  const result = await pool.query(
    `INSERT INTO lists (board_id, title, position) VALUES ($1, $2, $3) RETURNING *`,
    [boardId, title, newPosition]
  );
  return { ...result.rows[0], cards: [] };
};

export const updateList = async (listId: string, title: string) => {
  const result = await pool.query(
    `UPDATE lists SET title = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [title, listId]
  );
  if (result.rows.length === 0) throw ApiError.notFound('List not found');
  return result.rows[0];
};

export const deleteList = async (listId: string) => {
  const result = await pool.query(
    'DELETE FROM lists WHERE id = $1 RETURNING id',
    [listId]
  );
  if (result.rows.length === 0) throw ApiError.notFound('List not found');
};

// Bulk reorder: receives array of { id, position }
export const reorderLists = async (
  updates: Array<{ id: string; position: number }>
) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const { id, position } of updates) {
      await client.query(
        'UPDATE lists SET position = $1, updated_at = NOW() WHERE id = $2',
        [position, id]
      );
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};
