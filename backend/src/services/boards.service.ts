import pool from '../config/database';
import { ApiError } from '../utils/ApiError';

export const getBoards = async () => {
  const result = await pool.query(
    `SELECT b.*, 
      COUNT(DISTINCT l.id) AS list_count,
      COUNT(DISTINCT c.id) AS card_count
     FROM boards b
     LEFT JOIN lists l ON l.board_id = b.id
     LEFT JOIN cards c ON c.list_id = l.id AND c.is_archived = false
     GROUP BY b.id
     ORDER BY b.created_at DESC`
  );
  return result.rows;
};

export const getBoardById = async (boardId: string) => {
  const boardResult = await pool.query(
    'SELECT * FROM boards WHERE id = $1',
    [boardId]
  );
  if (boardResult.rows.length === 0) {
    throw ApiError.notFound('Board not found');
  }

  const listsResult = await pool.query(
    `SELECT l.*, 
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'id', c.id,
          'title', c.title,
          'description', c.description,
          'position', c.position,
          'cover_color', c.cover_color,
          'cover_image', c.cover_image,
          'due_date', c.due_date,
          'is_archived', c.is_archived,
          'labels', (
            SELECT JSON_AGG(JSON_BUILD_OBJECT('id', lb.id, 'name', lb.name, 'color', lb.color))
            FROM card_labels cl JOIN labels lb ON lb.id = cl.label_id
            WHERE cl.card_id = c.id
          ),
          'members', (
            SELECT JSON_AGG(JSON_BUILD_OBJECT('id', m.id, 'name', m.name, 'avatar_color', m.avatar_color, 'avatar_url', m.avatar_url))
            FROM card_members cm JOIN members m ON m.id = cm.member_id
            WHERE cm.card_id = c.id
          ),
          'checklist_progress', (
            SELECT JSON_BUILD_OBJECT(
              'total', COUNT(ci.id),
              'completed', COUNT(ci.id) FILTER (WHERE ci.is_completed = true)
            )
            FROM checklists ch JOIN checklist_items ci ON ci.checklist_id = ch.id
            WHERE ch.card_id = c.id
          )
        ) ORDER BY c.position
      ) FILTER (WHERE c.id IS NOT NULL AND c.is_archived = false) AS cards
     FROM lists l
     LEFT JOIN cards c ON c.list_id = l.id
     WHERE l.board_id = $1
     GROUP BY l.id
     ORDER BY l.position`,
    [boardId]
  );

  const labelsResult = await pool.query(
    'SELECT * FROM labels WHERE board_id = $1 ORDER BY name',
    [boardId]
  );

  const membersResult = await pool.query(
    `SELECT m.* FROM members m
     JOIN board_members bm ON bm.member_id = m.id
     WHERE bm.board_id = $1`,
    [boardId]
  );

  return {
    ...boardResult.rows[0],
    lists: listsResult.rows.map((list) => ({
      ...list,
      cards: list.cards ?? [],
    })),
    labels: labelsResult.rows,
    members: membersResult.rows,
  };
};

export const createBoard = async (title: string, background_color: string) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const boardResult = await client.query(
      `INSERT INTO boards (title, background_color) VALUES ($1, $2) RETURNING *`,
      [title, background_color]
    );
    const board = boardResult.rows[0];

    // Add default labels for the new board
    const defaultLabels = [
      { name: 'Bug', color: '#EB5A46' },
      { name: 'Feature', color: '#61BD4F' },
      { name: 'Design', color: '#C377E0' },
      { name: 'Research', color: '#F2D600' },
      { name: 'High Priority', color: '#FF9F1A' },
      { name: 'Backend', color: '#0079BF' },
    ];

    for (const label of defaultLabels) {
      await client.query(
        'INSERT INTO labels (board_id, name, color) VALUES ($1, $2, $3)',
        [board.id, label.name, label.color]
      );
    }

    await client.query('COMMIT');
    return board;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const updateBoard = async (
  boardId: string,
  data: { title?: string; background_color?: string; background_image?: string }
) => {
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (data.title !== undefined) { fields.push(`title = $${idx++}`); values.push(data.title); }
  if (data.background_color !== undefined) { fields.push(`background_color = $${idx++}`); values.push(data.background_color); }
  if (data.background_image !== undefined) { fields.push(`background_image = $${idx++}`); values.push(data.background_image); }

  if (fields.length === 0) throw ApiError.badRequest('No fields to update');

  fields.push(`updated_at = NOW()`);
  values.push(boardId);

  const result = await pool.query(
    `UPDATE boards SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
    values
  );
  if (result.rows.length === 0) throw ApiError.notFound('Board not found');
  return result.rows[0];
};

export const deleteBoard = async (boardId: string) => {
  const result = await pool.query(
    'DELETE FROM boards WHERE id = $1 RETURNING id',
    [boardId]
  );
  if (result.rows.length === 0) throw ApiError.notFound('Board not found');
};

export const getArchivedCards = async (boardId: string) => {
  const result = await pool.query(
    `SELECT c.*, l.title AS list_title
     FROM cards c
     JOIN lists l ON l.id = c.list_id
     WHERE l.board_id = $1 AND c.is_archived = true
     ORDER BY c.updated_at DESC`,
    [boardId]
  );
  return result.rows;
};
