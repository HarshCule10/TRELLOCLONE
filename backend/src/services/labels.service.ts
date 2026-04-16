import pool from '../config/database';
import { ApiError } from '../utils/ApiError';

export const getLabelsByBoard = async (boardId: string) => {
  const result = await pool.query(
    'SELECT * FROM labels WHERE board_id = $1 ORDER BY name',
    [boardId]
  );
  return result.rows;
};

export const createLabel = async (boardId: string, name: string, color: string) => {
  const result = await pool.query(
    'INSERT INTO labels (board_id, name, color) VALUES ($1, $2, $3) RETURNING *',
    [boardId, name, color]
  );
  return result.rows[0];
};

export const updateLabel = async (labelId: string, name: string, color: string) => {
  const result = await pool.query(
    'UPDATE labels SET name = $1, color = $2 WHERE id = $3 RETURNING *',
    [name, color, labelId]
  );
  if (result.rows.length === 0) throw ApiError.notFound('Label not found');
  return result.rows[0];
};

export const deleteLabel = async (labelId: string) => {
  const result = await pool.query(
    'DELETE FROM labels WHERE id = $1 RETURNING id',
    [labelId]
  );
  if (result.rows.length === 0) throw ApiError.notFound('Label not found');
};

export const addLabelToCard = async (cardId: string, labelId: string) => {
  await pool.query(
    'INSERT INTO card_labels (card_id, label_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
    [cardId, labelId]
  );
};

export const removeLabelFromCard = async (cardId: string, labelId: string) => {
  await pool.query(
    'DELETE FROM card_labels WHERE card_id = $1 AND label_id = $2',
    [cardId, labelId]
  );
};
