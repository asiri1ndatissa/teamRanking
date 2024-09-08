import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import jsonData from './seasonInfo.json';
import { TeamStat } from '../../types/season';
import { dummyCoachData, dummyPlayerData } from './dummyData';

type WeightsType = {
  winLossRatio: number;
  mapWinLossRatio: number;
  roundLossDifferential: number;
  headToHead: number;
  commonOpponents: number;
};

let teamStat: { [key: string]: TeamStat } = {};
let headToHead: any = [];

const weightsInitial : WeightsType = {
  winLossRatio: 0.7,
  mapWinLossRatio: 0.15,
  roundLossDifferential: 0.15,
  headToHead: 0.0,
  commonOpponents: 0.0,
};

const weightsAdjusted = {
  winLossRatio: 0.7,
  mapWinLossRatio: 0.1,
  roundLossDifferential: 0.1,
  headToHead: 0.05,
  commonOpponents: 0.05,
};

// const onGoingMatches = jsonData.stages[0].matches.filter((match) => parseInt(match.matchNumber) < 25);
const onGoingMatches = jsonData.stages.map((stage) => stage.matches).flat();

const updateStats = (team: string, mapWin: number, mapLoss: number, roundsWin: number, roundsLoss: number, opponent: any) => {
  if (!teamStat[team]) {
    teamStat[team] = {
      wins: 0,
      losses: 0,
      mapWon: 0,
      mapLoss: 0,
      roundsWon: 0,
      roundsLost: 0,
      opponents: [],
      matchesWin: [],
      matchesLoses: [],
    };
  }
  if (mapWin > mapLoss) {
    teamStat[team].matchesWin.push(opponent);
    teamStat[team].wins++;
  } else {
    teamStat[team].matchesLoses.push(opponent);
    teamStat[team].losses++;
  }
  //   teamStat[team].wins += mapWin > mapLoss ? 1 : 0;
  //   teamStat[team].losses += mapWin < mapLoss ? 1 : 0;
  teamStat[team].mapWon += mapWin;
  teamStat[team].mapLoss += mapLoss;
  teamStat[team].roundsWon += roundsWin;
  teamStat[team].roundsLost += roundsLoss;

  if (!teamStat[team].opponents.includes(opponent)) {
    teamStat[team].opponents.push(opponent);
  }
};

const updateHeadToHead = (teamA: string | number, teamB: string | number, mapWin: number, mapLoss: number) => {

  const getHeadToHead: any = headToHead.find((head: { [x: string]: any; }) => head[teamA] === teamB);
  const otherWay = headToHead.find((head: { [x: string]: any; }) => head[teamB] === teamA);
  if (getHeadToHead) {
    getHeadToHead.record += mapWin > mapLoss ? 1 : -1;
    headToHead.push(...headToHead, getHeadToHead);
  } else if (otherWay) {
    console.log('otherWay:', otherWay);
  } else if(!getHeadToHead?.record && !otherWay?.record) {
    headToHead.push( {
      [teamA]: teamB,
      record: mapWin > mapLoss ? 1 : -1,
    });
  }
};

const prepareTeamStatsForRanking = (matches: any[]) => {
  matches.forEach((match: { roundResults?: any; homeTeam?: any; awayTeam?: any; finalResults?: any; }) => {
    const { homeTeam, awayTeam, finalResults } = match;
    const homeMapWin = finalResults.homeTeam.mapWin ? parseInt(finalResults.homeTeam.mapWin) : 0;
    const awayMapWin = finalResults.awayTeam.mapWin ? parseInt(finalResults.awayTeam.mapWin) : 0;

    let homeRoundsWin = 0;
    let awayRoundsWin = 0;

    for (const game in match.roundResults) {
      const gameResult = match.roundResults[game];
      homeRoundsWin += parseInt(gameResult.homeTeam.roundsWin);
      awayRoundsWin += parseInt(gameResult.awayTeam.roundsWin);
    }

    updateStats(homeTeam, homeMapWin, awayMapWin, homeRoundsWin, awayRoundsWin, awayTeam);
    updateStats(awayTeam, awayMapWin, homeMapWin, awayRoundsWin, homeRoundsWin, homeTeam);
    updateHeadToHead(homeTeam, awayTeam, homeMapWin, awayMapWin);
  });
};

function GetCommonOpponentRecords(teamA : string, teamB : string ) {
  const commonOpponents = teamStat[teamA]?.opponents.filter((opponent: any) =>
    teamStat[teamB]?.opponents.includes(opponent),
  );
  const record = commonOpponents.reduce(
    (acc: { [x: string]: number; }, opponent: any, index: number) => {
      const teamARecord = teamStat[teamA]?.matchesWin.includes(opponent) ? 1 : 0;
      const teamBRecord = teamStat[teamB]?.matchesWin.includes(opponent) ? 1 : 0;
      acc[teamA] += teamARecord;
      acc[teamB] += teamBRecord;
      if (commonOpponents.length === index + 1) {
        const denominator = acc[teamA] > acc[teamB] ? acc[teamA] : acc[teamB] > 0 ? acc[teamB] : 1;
        acc[teamA] = acc[teamA] / denominator;
        acc[teamB] = acc[teamB] / denominator;
      }
      return acc;
    },
    { [teamA]: 0, [teamB]: 0 },
  );
  return record[teamA] - record[teamB] || 0;
}

function calculateWinLossRatio(wins: number, losses: number ) {
  return wins / (losses > 0 ? losses : 1);
}

function calculateTeamScoreNoNegative(stats : TeamStat, weights: WeightsType ) {
  let winLossRatio = calculateWinLossRatio(stats.wins,  stats.losses );
 // winLossRatio = stats.isStackedGroup ? winLossRatio * 1.5 : winLossRatio;
  const roundLossDifferential = stats.roundsWon / (stats.roundsLost > 0 ? stats.roundsLost : 1);
  const finalScore = weights.winLossRatio * winLossRatio + weights.roundLossDifferential * roundLossDifferential;
  return Math.max(finalScore, 0);
}

function calculateTeamScoreAdjusted(team: string , stats: TeamStat , weights: WeightsType, ranking: any) {
  let winLossRatio = calculateWinLossRatio(stats.wins, stats.losses );
 // winLossRatio = stats.isStackedGroup ? winLossRatio * 1.5 : winLossRatio;
  const roundLossDifferential = stats.roundsWon / (stats.roundsLost > 0 ? stats.roundsLost : 1);

  const rankIndex = ranking.findIndex((r: { team: any; }) => r.team === team);
  const withinOneRank = [
    ranking[rankIndex - 1] ? ranking[rankIndex - 1] : null,
    ranking[rankIndex + 1] ? ranking[rankIndex + 1] : null,
  ];
  const currentScore = ranking[rankIndex];
  let accScore = 0;
  withinOneRank.forEach((opponent) => {
    if (opponent) {
      const headToHeadScore = headToHead.find((head: { [x: string]: any; }) => head[team] === opponent.team);
      if (headToHeadScore) {
        const accScore1 =
          weights.winLossRatio * winLossRatio +
          weights.roundLossDifferential * roundLossDifferential +
          weights.headToHead * headToHeadScore.record;
        // console.log('withinOneRank: 1', accScore, team, opponent.team);

        accScore += Math.max(accScore1, 0);
      }
      const commonOpponentScore =
        GetCommonOpponentRecords(team, opponent.team ) * weights.commonOpponents;
      accScore += Math.max(commonOpponentScore, 0);
    }
  });
  return Math.max(accScore, currentScore.score);
}

function getInitialRanking(teamStat: { [key: string]: TeamStat }, weights: WeightsType) {
  const scores: any = [];
  for (const team in teamStat) {
    const rankingWeight = calculateTeamScoreNoNegative(teamStat[team], weights );
    scores.push({ team, score: rankingWeight });
  }
  const sortedScores = scores.sort((a: { score: number; }, b: { score: number; }) => b.score - a.score);
  return sortedScores;
}

function rankTeamsAdjusted() {
  const initialRanking = getInitialRanking(teamStat, weightsInitial );
  const adjustedRanking:any[]  = [];
  initialRanking.forEach((teamScore: { team: string; }) => {
    const adjustedScore = calculateTeamScoreAdjusted(
      teamScore.team,
      teamStat[teamScore.team],
      weightsAdjusted,
      initialRanking,
    );
    adjustedRanking.push({
      teamId: uuidv4(),
      teamName: teamScore.team,
      points: adjustedScore,
      wins: teamStat[teamScore.team].wins,
      lost: teamStat[teamScore.team].losses,
      MapWon: teamStat[teamScore.team].mapWon,
      MapLoss: teamStat[teamScore.team].mapLoss,
      RoundsWon: teamStat[teamScore.team].roundsWon,
      RoundsLost: teamStat[teamScore.team].roundsLost,
      players: dummyPlayerData,
      coach: dummyCoachData,
      country: "Europe",
      flag: "https://www.hltv.org/img/static/flags/30x20/EU.gif",
      logo: "https://img-cdn.hltv.org/teamlogo/9iMirAi7ArBLNU8p3kqUTZ.svg?ixlib=java-2.1.0&s=4dd8635be16122656093ae9884675d0c",

    });
  });
  adjustedRanking.sort((a: { points: number; }, b: { points: number; }) => b.points - a.points);
  const maxPoints = 1000;
  const minPoints = 200;
  const pointDiv = maxPoints / adjustedRanking[0].points;
  
  adjustedRanking.forEach((entry, index) => {
    entry.rank = index + 1;
    const calculatedPoints = pointDiv * entry.points
    entry.points =   calculatedPoints < minPoints ? minPoints : +calculatedPoints.toFixed(2);
  });
  return adjustedRanking;
}

export function updatedRanking() {
  // clear headToHead
  headToHead = [];
  teamStat = {}
  prepareTeamStatsForRanking(onGoingMatches);
  const ranking = rankTeamsAdjusted();
 // console.log('ranking:', headToHead);
  //const json = JSON.stringify(ranking);
  //fs.writeFile('Stage01.json', json, 'utf8', () => console.log('File written'));
  return ranking;
}
