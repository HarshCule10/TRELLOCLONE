import { Router } from 'express';
import * as membersCtrl from '../controllers/members.controller';

const router = Router();

router.get('/', membersCtrl.getAllMembers);

export default router;
