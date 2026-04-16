import { Router } from 'express';
import * as listsCtrl from '../controllers/lists.controller';
import * as cardsCtrl from '../controllers/cards.controller';
import { validate } from '../middleware/validateRequest';
import { z } from 'zod';

const router = Router();

router.put('/reorder', validate(z.object({
  updates: z.array(z.object({ id: z.string().uuid(), position: z.number() })).min(1)
})), listsCtrl.reorderLists);

router.put('/:id', validate(z.object({ title: z.string().min(1).max(255) })), listsCtrl.updateList);
router.delete('/:id', listsCtrl.deleteList);

// Cards under list
router.post('/:listId/cards', validate(z.object({ title: z.string().min(1).max(255) })), cardsCtrl.createCard);

export default router;
