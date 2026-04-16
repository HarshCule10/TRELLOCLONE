import { Router } from 'express';
import boardsRoutes from './boards.routes';
import listsRoutes from './lists.routes';
import cardsRoutes from './cards.routes';
import labelsRoutes from './labels.routes';
import checklistsRoutes from './checklists.routes';
import checklistItemsRoutes from './checklistItems.routes';
import membersRoutes from './members.routes';

const router = Router();

router.use('/boards', boardsRoutes);
router.use('/lists', listsRoutes);
router.use('/cards', cardsRoutes);
router.use('/labels', labelsRoutes);
router.use('/checklists', checklistsRoutes);
router.use('/checklist-items', checklistItemsRoutes);
router.use('/members', membersRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ success: true, message: 'API is running', timestamp: new Date().toISOString() });
});

export default router;
