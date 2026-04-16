import pool from '../config/database';
import { ApiError } from '../utils/ApiError';

export const getAllMembers = async () => {
  const result = await pool.query(
    'SELECT id, name, email, avatar_url, avatar_color FROM members ORDER BY name'
  );
  return result.rows;
};

export const getMemberById = async (memberId: string) => {
  const result = await pool.query(
    'SELECT id, name, email, avatar_url, avatar_color FROM members WHERE id = $1',
    [memberId]
  );
  if (result.rows.length === 0) throw ApiError.notFound('Member not found');
  return result.rows[0];
};

export const addMemberToCard = async (cardId: string, memberId: string) => {
  await pool.query(
    'INSERT INTO card_members (card_id, member_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
    [cardId, memberId]
  );
  return getMemberById(memberId);
};

export const removeMemberFromCard = async (cardId: string, memberId: string) => {
  await pool.query(
    'DELETE FROM card_members WHERE card_id = $1 AND member_id = $2',
    [cardId, memberId]
  );
};
