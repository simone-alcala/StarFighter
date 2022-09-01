import axios from 'axios';

import * as repository from './../repositories/fightersRepository.js';

export type BattleData = {
  firstUser: string;
  secondUser: string;
}

export async function battle(data: BattleData) {

  if (data.firstUser === data.secondUser) {
    updateDataSameUser(data);
    return { winner: null,  loser: null, draw: true };
  }

  const firstUserInfo = await getUserGitHub(data.firstUser);
  const secondUserInfo = await getUserGitHub(data.secondUser);

  const firstUserStars = getStargazers(firstUserInfo);
  const secondUserStars = getStargazers(secondUserInfo);

  const firstUserToCompare = {
    name: data.firstUser,
    stars: firstUserStars
  }

  const secondUserToCompare = {
    name: data.secondUser,
    stars: secondUserStars
  }

  const result = compare(firstUserToCompare, secondUserToCompare);  
  
  await updateData(result, data);

  return result;

}

async function getUserGitHub(user: string) {
  const url = `https://api.github.com/users/${user}/repos`;  
  const result = await axios.get(url);  
  return result.data;
}

function getStargazers(data: any) {
  let total = 0;
  for (let i = 0; i < data.length; i++) {
    total += data.stargazers_count;
  }
  return total;
}

function compare(firstUser: any, secondUser: any) {
  if (firstUser.stars > secondUser.stars) {
    return { winner: firstUser.name,  loser: secondUser.name, draw: false };
  } else if (firstUser.stars < secondUser.stars) {
    return { winner: secondUser.name,  loser: firstUser.name, draw: false };
  } else {
    return { winner: null,  loser: null, draw: true };
  }
}

async function updateDataSameUser (data: BattleData) {

  let draw = await getUserInfoDatabase (data.firstUser);

  if ( !draw ) {
    await repository.insert(data.firstUser);
    draw = await getUserInfoDatabase(data.firstUser);
  }

  const draws = draw.draws + 1;
  await repository.updateDraws(data.firstUser, draws);

}

async function updateData(result: any, data: BattleData) {
  
  let infoWinner = '';
  let infoLoser = '';

  if (result.draw) {
    infoWinner = data.firstUser;
    infoLoser = data.secondUser;
  } else {
    infoWinner = result.winner;
    infoLoser = result.loser;
  }
  
  let winner = await getUserInfoDatabase (infoWinner);
  let loser = await getUserInfoDatabase (infoLoser);
  
  if ( !winner ) {
    await repository.insert(infoWinner);
    winner = await getUserInfoDatabase (infoWinner);
  }
  
  if ( !loser ) {
    await repository.insert(infoLoser);
    loser = await getUserInfoDatabase (infoLoser);
  }

  if ( !result.draw ) {
    
    const wins = winner.wins + 1;
    const losses = loser.losses + 1;   
    
    await repository.updateWins(infoWinner, wins);
    await repository.updateLosses(infoLoser, losses);

  } else {
  
    const winnerDraws = winner.draws + 1;
    const loserDraws = loser.draws + 1;   
    
    await repository.updateDraws(infoWinner, winnerDraws);
    await repository.updateDraws(infoLoser, loserDraws);
  }

}

async function getUserInfoDatabase (username: string) {
  return await repository.findByName(username);
}