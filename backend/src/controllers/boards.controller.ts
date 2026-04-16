import { Request, Response, NextFunction } from 'express';
import * as boardsService from '../services/boards.service';

export const getBoards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const boards = await boardsService.getBoards();
    res.json({ success: true, data: boards });
  } catch (err) { next(err); }
};

export const getBoardById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const board = await boardsService.getBoardById(req.params['id']!);
    res.json({ success: true, data: board });
  } catch (err) { next(err); }
};

export const createBoard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, background_color = '#026AA7' } = req.body as { title: string; background_color?: string };
    const board = await boardsService.createBoard(title, background_color);
    res.status(201).json({ success: true, data: board });
  } catch (err) { next(err); }
};

export const updateBoard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const board = await boardsService.updateBoard(req.params['id']!, req.body as { title?: string; background_color?: string; background_image?: string });
    res.json({ success: true, data: board });
  } catch (err) { next(err); }
};

export const deleteBoard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await boardsService.deleteBoard(req.params['id']!);
    res.json({ success: true, message: 'Board deleted' });
  } catch (err) { next(err); }
};

export const getArchivedCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await boardsService.getArchivedCards(req.params['id']!);
    res.json({ success: true, data: cards });
  } catch (err) { next(err); }
};
