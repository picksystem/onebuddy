import { Router } from 'express';

import notFoundRoutes from './NotFound/NotFound.routes';
import { CAPTAIN_PATHS } from '@bandi/constants';

const router = Router();

router.use(`/${CAPTAIN_PATHS.NOT_FOUND}`, notFoundRoutes);

export default router;
