import { Router } from 'express';
import * as labelsCtrl from '../controllers/labels.controller';
import { validate } from '../middleware/validateRequest';
import { z } from 'zod';

const router = Router();

router.put('/:id', validate(z.object({ name: z.string().max(255).optional(), color: z.string().min(1) })), labelsCtrl.updateLabel);
router.delete('/:id', labelsCtrl.deleteLabel);

export default router;
