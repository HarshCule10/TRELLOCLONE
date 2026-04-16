import { Router } from 'express';
import * as checklistsCtrl from '../controllers/checklists.controller';
import { validate } from '../middleware/validateRequest';
import { z } from 'zod';

const router = Router();

router.put('/:id', validate(z.object({
  title: z.string().min(1).optional(),
  is_completed: z.boolean().optional()
})), checklistsCtrl.updateChecklistItem);

router.delete('/:id', checklistsCtrl.deleteChecklistItem);

export default router;
