import axios from "axios";
import {
  Entries,
  Match,
  MatchHistory,
  RawResponse,
  SummonerData,
  SummonerV4,
} from "src/commands/league/types/type";
import { config } from "src/config/config";

export const getLatestVersion = async (): Promise<string> => {
  const response = await axios.get(
    "https://ddragon.leagueoflegends.com/api/versions.json"
  );
  const versions = response.data;
  return versions[0];
};

export const getLeagueSummoner = async (
  puuid: string,
  server: string
): Promise<SummonerV4> => {
  const response = await axios.get(
    `https://${server}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`,
    {
      headers: {
        "X-Riot-Token": config.RIOT_API_KEY,
      },
    }
  );

  return response.data;
};

export const listMatch = async function (
  puuid: string,
  region: string,
  start: number = 0,
  count: number = 1
): Promise<string[]> {
  const response = await axios.get(
    `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}`,
    {
      headers: {
        "X-Riot-Token": config.RIOT_API_KEY,
      },
    }
  );

  return response.data;
};

export const getMatch = async function (
  matchId: string,
  region: string
): Promise<Match> {
  const response = await axios.get(
    `https://${region}.api.riotgames.com/lol/match/v5/matches/${matchId}`,
    {
      headers: {
        "X-Riot-Token": config.RIOT_API_KEY,
      },
    }
  );

  return response.data;
};

export const createMatchHistory = async function (
  puuid: string,
  region: string,
  matchId: string
): Promise<MatchHistory[]> {
  const matchHistory = [] as MatchHistory[];

  const match = await getMatch(matchId, region);
  const { info } = match;

  const { participants, ...restInfo } = info;

  const participantId = participants.findIndex(
    (participant) => participant.puuid === puuid
  );

  const participant = participants[participantId];
  const matchData = { participant, info: restInfo };

  matchHistory.push(matchData);

  return matchHistory;
};

export const getRankedInfo = async (
  summonerId: string,
  server: string,
  queueType: string
) => {
  const response: RawResponse<Entries[]> = await axios.get(
    `https://${server}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`,
    {
      headers: {
        "X-Riot-Token": config.RIOT_API_KEY,
      },
    }
  );

  const soloInfo = response.data.find((queue) => queue.queueType === queueType);

  return soloInfo;
};

export const getSummerbyNameTag = async (
  gameName: string,
  tagLine: string,
  region: string
) => {
  const response = await axios.get<SummonerData>(
    `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`,
    {
      headers: {
        "X-Riot-Token": config.RIOT_API_KEY,
      },
    }
  );

  return response;
};
