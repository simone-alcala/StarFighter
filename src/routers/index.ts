import { Router } from 'express';

import fightersRouter from './fightersRouter.js';

const router = Router();

router.use(fightersRouter);

export default router;