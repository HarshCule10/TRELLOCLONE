import { Router } from 'express';
import * as checklistsCtrl from '../controllers/checklists.controller';
import { validate } from '../middleware/validateRequest';
import { z } from 'zod';

const router = Router();

// Checklist CRUD
router.put('/:id', validate(z.object({ title: z.string().min(1).max(255) })), checklistsCtrl.updateChecklist);
router.delete('/:id', checklistsCtrl.deleteChecklist);

// Checklist items
router.post('/:checklistId/items', validate(z.object({ title: z.string().min(1) })), checklistsCtrl.createChecklistItem);

export default router;
