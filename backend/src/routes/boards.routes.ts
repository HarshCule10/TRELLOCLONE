import { Router } from 'express';
import * as boardsCtrl from '../controllers/boards.controller';
import * as listsCtrl from '../controllers/lists.controller';
import * as labelsCtrl from '../controllers/labels.controller';
import { search } from '../controllers/search.controller';
import { validate } from '../middleware/validateRequest';
import { z } from 'zod';

const router = Router();

const createBoardSchema = z.object({ title: z.string().min(1).max(255) });

router.get('/', boardsCtrl.getBoards);
router.post('/', validate(createBoardSchema), boardsCtrl.createBoard);
router.get('/:id', boardsCtrl.getBoardById);
router.put('/:id', boardsCtrl.updateBoard);
router.delete('/:id', boardsCtrl.deleteBoard);
router.get('/:id/archived-cards', boardsCtrl.getArchivedCards);

// Lists under board
router.post('/:boardId/lists', validate(z.object({ title: z.string().min(1).max(255) })), listsCtrl.createList);

// Labels under board
router.get('/:boardId/labels', labelsCtrl.getLabelsByBoard);
router.post('/:boardId/labels', validate(z.object({ name: z.string().max(255).optional(), color: z.string().min(1) })), labelsCtrl.createLabel);

// Search under board
router.get('/:boardId/search', search);

export default router;
