import { Request, Response } from 'express';

import * as service from './../services/fightersService.js';

export async function battle(req: Request, res: Response) {
  const { firstUser, secondUser } : service.BattleData = req.body;
  const result = await service.battle({ firstUser, secondUser });
  res.status(201).send(result);
}

export async function ranking(req: Request, res: Response) {

  res.sendStatus(200);
}