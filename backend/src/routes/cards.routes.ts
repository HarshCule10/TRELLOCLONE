import { Router } from 'express';
import * as cardsCtrl from '../controllers/cards.controller';
import * as labelsCtrl from '../controllers/labels.controller';
import * as membersCtrl from '../controllers/members.controller';
import * as checklistsCtrl from '../controllers/checklists.controller';
import { validate } from '../middleware/validateRequest';
import { z } from 'zod';

const router = Router();

// Reorder must come before /:id
router.put('/reorder', validate(z.object({
  updates: z.array(z.object({
    id: z.string().uuid(),
    position: z.number(),
    list_id: z.string().uuid()
  })).min(1)
})), cardsCtrl.reorderCards);

// Card CRUD
router.get('/:id', cardsCtrl.getCardById);
router.put('/:id', cardsCtrl.updateCard);
router.delete('/:id', cardsCtrl.deleteCard);

// Labels on card
router.post('/:cardId/labels/:labelId', labelsCtrl.addLabelToCard);
router.delete('/:cardId/labels/:labelId', labelsCtrl.removeLabelFromCard);

// Members on card
router.post('/:cardId/members/:memberId', membersCtrl.addMemberToCard);
router.delete('/:cardId/members/:memberId', membersCtrl.removeMemberFromCard);

// Checklists on card
router.post('/:cardId/checklists', validate(z.object({ title: z.string().min(1).max(255).optional() })), checklistsCtrl.createChecklist);

export default router;
