import { Request, Response, NextFunction } from 'express';
import * as checklistsService from '../services/checklists.service';

export const createChecklist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title = 'Checklist' } = req.body as { title?: string };
    const checklist = await checklistsService.createChecklist(req.params['cardId']!, title);
    res.status(201).json({ success: true, data: checklist });
  } catch (err) { next(err); }
};

export const updateChecklist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title } = req.body as { title: string };
    const checklist = await checklistsService.updateChecklist(req.params['id']!, title);
    res.json({ success: true, data: checklist });
  } catch (err) { next(err); }
};

export const deleteChecklist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await checklistsService.deleteChecklist(req.params['id']!);
    res.json({ success: true, message: 'Checklist deleted' });
  } catch (err) { next(err); }
};

export const createChecklistItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title } = req.body as { title: string };
    const item = await checklistsService.createChecklistItem(req.params['checklistId']!, title);
    res.status(201).json({ success: true, data: item });
  } catch (err) { next(err); }
};

export const updateChecklistItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await checklistsService.updateChecklistItem(req.params['id']!, req.body as { title?: string; is_completed?: boolean });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
};

export const deleteChecklistItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await checklistsService.deleteChecklistItem(req.params['id']!);
    res.json({ success: true, message: 'Item deleted' });
  } catch (err) { next(err); }
};
