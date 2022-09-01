import { Router } from 'express';

import * as schema from './../schemas/fightersSchema.js';
import validateSchemaMiddleware from './../middlewares/validateSchemaMiddleware.js';

import * as fighters from './../controllers/fightersController.js';

const fightersRouter = Router();

fightersRouter.post('/battle', validateSchemaMiddleware(schema.battle),  fighters.battle);

export default fightersRouter;