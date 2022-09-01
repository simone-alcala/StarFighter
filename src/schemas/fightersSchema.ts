import Joi from 'joi';
import { BattleData } from './../services/fightersService.js';

export const battle = Joi.object<BattleData>({
  firstUser: Joi.string().required(),
  secondUser: Joi.string().required()
});