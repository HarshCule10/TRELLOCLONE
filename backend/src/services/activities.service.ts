import pool from '../config/database';

export const logActivity = async (
  cardId: string,
  memberId: string,
  actionType: string,
  description: string,
  metadata?: Record<string, unknown>
) => {
  await pool.query(
    `INSERT INTO activities (card_id, member_id, action_type, description, metadata)
     VALUES ($1, $2, $3, $4, $5)`,
    [cardId, memberId, actionType, description, metadata ? JSON.stringify(metadata) : null]
  );
};

export const searchCards = async (
  boardId: string,
  query?: string,
  labelIds?: string[],
  memberIds?: string[],
  dueDateFilter?: 'overdue' | 'due_soon' | 'no_due_date'
) => {
  const conditions: string[] = [
    'l.board_id = $1',
    'c.is_archived = false',
  ];
  const values: unknown[] = [boardId];
  let idx = 2;

  if (query) {
    conditions.push(`(c.title ILIKE $${idx} OR c.description ILIKE $${idx})`);
    values.push(`%${query}%`);
    idx++;
  }

  if (labelIds && labelIds.length > 0) {
    conditions.push(
      `EXISTS (SELECT 1 FROM card_labels cl WHERE cl.card_id = c.id AND cl.label_id = ANY($${idx}::uuid[]))`
    );
    values.push(labelIds);
    idx++;
  }

  if (memberIds && memberIds.length > 0) {
    conditions.push(
      `EXISTS (SELECT 1 FROM card_members cm WHERE cm.card_id = c.id AND cm.member_id = ANY($${idx}::uuid[]))`
    );
    values.push(memberIds);
    idx++;
  }

  if (dueDateFilter === 'overdue') {
    conditions.push(`c.due_date < NOW() AND c.due_date IS NOT NULL`);
  } else if (dueDateFilter === 'due_soon') {
    conditions.push(`c.due_date BETWEEN NOW() AND NOW() + INTERVAL '3 days'`);
  } else if (dueDateFilter === 'no_due_date') {
    conditions.push(`c.due_date IS NULL`);
  }

  const result = await pool.query(
    `SELECT c.*, l.title AS list_title,
      (SELECT JSON_AGG(JSON_BUILD_OBJECT('id', lb.id, 'name', lb.name, 'color', lb.color))
       FROM card_labels cl JOIN labels lb ON lb.id = cl.label_id WHERE cl.card_id = c.id) AS labels,
      (SELECT JSON_AGG(JSON_BUILD_OBJECT('id', m.id, 'name', m.name, 'avatar_color', m.avatar_color, 'avatar_url', m.avatar_url))
       FROM card_members cm JOIN members m ON m.id = cm.member_id WHERE cm.card_id = c.id) AS members
     FROM cards c
     JOIN lists l ON l.id = c.list_id
     WHERE ${conditions.join(' AND ')}
     ORDER BY c.position`,
    values
  );
  return result.rows;
};
