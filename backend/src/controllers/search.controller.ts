import { Request, Response, NextFunction } from 'express';
import { searchCards } from '../services/activities.service';

export const search = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q, labels, members, dueDate } = req.query as {
      q?: string;
      labels?: string;
      members?: string;
      dueDate?: 'overdue' | 'due_soon' | 'no_due_date';
    };

    const labelIds = labels ? labels.split(',').filter(Boolean) : undefined;
    const memberIds = members ? members.split(',').filter(Boolean) : undefined;

    const cards = await searchCards(req.params['boardId']!, q, labelIds, memberIds, dueDate);
    res.json({ success: true, data: cards });
  } catch (err) { next(err); }
};
