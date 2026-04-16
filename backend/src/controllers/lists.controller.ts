import { Request, Response, NextFunction } from 'express';
import * as listsService from '../services/lists.service';

export const createList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title } = req.body as { title: string };
    const list = await listsService.createList(req.params['boardId']!, title);
    res.status(201).json({ success: true, data: list });
  } catch (err) { next(err); }
};

export const updateList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title } = req.body as { title: string };
    const list = await listsService.updateList(req.params['id']!, title);
    res.json({ success: true, data: list });
  } catch (err) { next(err); }
};

export const deleteList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await listsService.deleteList(req.params['id']!);
    res.json({ success: true, message: 'List deleted' });
  } catch (err) { next(err); }
};

export const reorderLists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { updates } = req.body as { updates: Array<{ id: string; position: number }> };
    await listsService.reorderLists(updates);
    res.json({ success: true, message: 'Lists reordered' });
  } catch (err) { next(err); }
};
