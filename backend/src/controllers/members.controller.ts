import { Request, Response, NextFunction } from 'express';
import * as membersService from '../services/members.service';

export const getAllMembers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const members = await membersService.getAllMembers();
    res.json({ success: true, data: members });
  } catch (err) { next(err); }
};

export const addMemberToCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const member = await membersService.addMemberToCard(req.params['cardId']!, req.params['memberId']!);
    res.json({ success: true, data: member });
  } catch (err) { next(err); }
};

export const removeMemberFromCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await membersService.removeMemberFromCard(req.params['cardId']!, req.params['memberId']!);
    res.json({ success: true, message: 'Member removed from card' });
  } catch (err) { next(err); }
};
