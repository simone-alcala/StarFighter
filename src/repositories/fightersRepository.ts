import { database } from './../config/database.js';

export interface Fighter {
  username: string;
  wins: number;
  losses: number;
  draws: number;
}

export async function findByName( username: string) {
  const result = await database.query<Fighter, [string]>(
    'SELECT * FROM fighters WHERE username = $1', [username] );
  return result.rows[0];
}

export async function updateLosses( username: string, losses: number) {    
  database.query (`UPDATE fighters  SET losses = $1 WHERE username = $2`, [losses, username ] );
}

export async function updateWins( username: string, wins: number) {    
  database.query (`UPDATE fighters  SET wins = $1 WHERE username = $2`, [wins, username] );
}

export async function updateDraws( username: string, draws: number) {    
  database.query (`UPDATE fighters SET draws = $1 WHERE username = $2`, [draws, username] );
}

export async function insert( username: string) {
  const result = await database.query<Fighter, [string]>(
    'INSERT INTO fighters (username, wins, losses, draws) values ($1, 0, 0, 0) ', [username] );
  return result.rows[0];
}