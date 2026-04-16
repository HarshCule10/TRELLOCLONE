import { Request, Response, NextFunction } from 'express';
import * as labelsService from '../services/labels.service';

export const getLabelsByBoard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const labels = await labelsService.getLabelsByBoard(req.params['boardId']!);
    res.json({ success: true, data: labels });
  } catch (err) { next(err); }
};

export const createLabel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, color } = req.body as { name: string; color: string };
    const label = await labelsService.createLabel(req.params['boardId']!, name, color);
    res.status(201).json({ success: true, data: label });
  } catch (err) { next(err); }
};

export const updateLabel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, color } = req.body as { name: string; color: string };
    const label = await labelsService.updateLabel(req.params['id']!, name, color);
    res.json({ success: true, data: label });
  } catch (err) { next(err); }
};

export const deleteLabel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await labelsService.deleteLabel(req.params['id']!);
    res.json({ success: true, message: 'Label deleted' });
  } catch (err) { next(err); }
};

export const addLabelToCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await labelsService.addLabelToCard(req.params['cardId']!, req.params['labelId']!);
    res.json({ success: true, message: 'Label added to card' });
  } catch (err) { next(err); }
};

export const removeLabelFromCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await labelsService.removeLabelFromCard(req.params['cardId']!, req.params['labelId']!);
    res.json({ success: true, message: 'Label removed from card' });
  } catch (err) { next(err); }
};
