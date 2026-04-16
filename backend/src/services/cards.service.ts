import pool from '../config/database';
import { ApiError } from '../utils/ApiError';

export const createCard = async (listId: string, title: string) => {
  const posResult = await pool.query(
    'SELECT MAX(position) AS max_pos FROM cards WHERE list_id = $1 AND is_archived = false',
    [listId]
  );
  const maxPos = (posResult.rows[0]?.max_pos as number | null) ?? 0;
  const newPosition = maxPos + 1000;

  const result = await pool.query(
    `INSERT INTO cards (list_id, title, position) VALUES ($1, $2, $3) RETURNING *`,
    [listId, title, newPosition]
  );
  return { ...result.rows[0], labels: [], members: [], checklists: [] };
};

export const getCardById = async (cardId: string) => {
  const cardResult = await pool.query(
    'SELECT * FROM cards WHERE id = $1',
    [cardId]
  );
  if (cardResult.rows.length === 0) throw ApiError.notFound('Card not found');

  const labelsResult = await pool.query(
    `SELECT lb.* FROM labels lb
     JOIN card_labels cl ON cl.label_id = lb.id
     WHERE cl.card_id = $1`,
    [cardId]
  );

  const membersResult = await pool.query(
    `SELECT m.id, m.name, m.email, m.avatar_url, m.avatar_color FROM members m
     JOIN card_members cm ON cm.member_id = m.id
     WHERE cm.card_id = $1`,
    [cardId]
  );

  const checklistsResult = await pool.query(
    `SELECT ch.id, ch.title, ch.position,
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'id', ci.id,
          'title', ci.title,
          'is_completed', ci.is_completed,
          'position', ci.position
        ) ORDER BY ci.position
      ) FILTER (WHERE ci.id IS NOT NULL) AS items
     FROM checklists ch
     LEFT JOIN checklist_items ci ON ci.checklist_id = ch.id
     WHERE ch.card_id = $1
     GROUP BY ch.id
     ORDER BY ch.position`,
    [cardId]
  );

  const activitiesResult = await pool.query(
    `SELECT a.*, m.name AS member_name, m.avatar_color, m.avatar_url
     FROM activities a
     LEFT JOIN members m ON m.id = a.member_id
     WHERE a.card_id = $1
     ORDER BY a.created_at DESC
     LIMIT 50`,
    [cardId]
  );

  return {
    ...cardResult.rows[0],
    labels: labelsResult.rows,
    members: membersResult.rows,
    checklists: checklistsResult.rows.map((ch) => ({
      ...ch,
      items: ch.items ?? [],
    })),
    activities: activitiesResult.rows,
  };
};

export const updateCard = async (
  cardId: string,
  data: {
    title?: string;
    description?: string;
    due_date?: string | null;
    cover_color?: string | null;
    cover_image?: string | null;
    is_archived?: boolean;
    is_completed?: boolean;
  }
) => {
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (data.title !== undefined) { fields.push(`title = $${idx++}`); values.push(data.title); }
  if (data.description !== undefined) { fields.push(`description = $${idx++}`); values.push(data.description); }
  if (data.due_date !== undefined) { fields.push(`due_date = $${idx++}`); values.push(data.due_date); }
  if (data.cover_color !== undefined) { fields.push(`cover_color = $${idx++}`); values.push(data.cover_color); }
  if (data.cover_image !== undefined) { fields.push(`cover_image = $${idx++}`); values.push(data.cover_image); }
  if (data.is_archived !== undefined) { fields.push(`is_archived = $${idx++}`); values.push(data.is_archived); }
  if (data.is_completed !== undefined) { fields.push(`is_completed = $${idx++}`); values.push(data.is_completed); }

  if (fields.length === 0) throw ApiError.badRequest('No fields to update');

  fields.push(`updated_at = NOW()`);
  values.push(cardId);

  const result = await pool.query(
    `UPDATE cards SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
    values
  );
  if (result.rows.length === 0) throw ApiError.notFound('Card not found');
  return result.rows[0];
};

export const deleteCard = async (cardId: string) => {
  const result = await pool.query(
    'DELETE FROM cards WHERE id = $1 RETURNING id',
    [cardId]
  );
  if (result.rows.length === 0) throw ApiError.notFound('Card not found');
};

// Move card: update list_id and position (cross-list drag-and-drop)
export const moveCard = async (
  cardId: string,
  newListId: string,
  newPosition: number
) => {
  const result = await pool.query(
    `UPDATE cards SET list_id = $1, position = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
    [newListId, newPosition, cardId]
  );
  if (result.rows.length === 0) throw ApiError.notFound('Card not found');
  return result.rows[0];
};

// Bulk reorder cards (within same list)
export const reorderCards = async (
  updates: Array<{ id: string; position: number; list_id: string }>
) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const { id, position, list_id } of updates) {
      await client.query(
        'UPDATE cards SET position = $1, list_id = $2, updated_at = NOW() WHERE id = $3',
        [position, list_id, id]
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
