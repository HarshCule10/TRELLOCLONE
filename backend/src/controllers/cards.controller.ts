import { Request, Response, NextFunction } from 'express';
import * as cardsService from '../services/cards.service';
import { logActivity } from '../services/activities.service';

// Default member ID for activity logging (first seeded member)
const DEFAULT_MEMBER_ID = 'a0000001-0000-0000-0000-000000000001';

export const createCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title } = req.body as { title: string };
    const card = await cardsService.createCard(req.params['listId']!, title);
    await logActivity(card.id as string, DEFAULT_MEMBER_ID, 'card_created', `Alex Johnson added this card`);
    res.status(201).json({ success: true, data: card });
  } catch (err) { next(err); }
};

export const getCardById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const card = await cardsService.getCardById(req.params['id']!);
    res.json({ success: true, data: card });
  } catch (err) { next(err); }
};

export const updateCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const card = await cardsService.updateCard(req.params['id']!, req.body as {
      title?: string; description?: string; due_date?: string | null;
      cover_color?: string | null; cover_image?: string | null; is_archived?: boolean; is_completed?: boolean;
    });
    res.json({ success: true, data: card });
  } catch (err) { next(err); }
};

export const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await cardsService.deleteCard(req.params['id']!);
    res.json({ success: true, message: 'Card deleted' });
  } catch (err) { next(err); }
};

export const reorderCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { updates } = req.body as { updates: Array<{ id: string; position: number; list_id: string }> };
    await cardsService.reorderCards(updates);
    res.json({ success: true, message: 'Cards reordered' });
  } catch (err) { next(err); }
};
