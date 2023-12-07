const { default: axios } = require("axios");
import { config } from "../../config/config";
import { Entries, Match, RawResponse, SummonerV4, matchHistory } from "./type";

const riotUtils = {
  getRegion: function (server: string): string {
    switch (server.toUpperCase()) {
      case "BR1":
      case "LA1":
      case "LA2":
      case "NA1":
      case "OC1":
        return "americas";
      case "JP":
      case "KR":
        return "asia";
      case "EUN1":
      case "EUW1":
      case "RU":
      case "TR1":
        return "europe";
      case "TW2":
        return "sea";
    }

    return "";
  },

  getSaneServer: function (server: string): string {
    switch (server.toUpperCase()) {
      case "BR":
      case "EUN":
      case "EUW":
      case "JP":
      case "NA":
      case "OC":
      case "TR":
        return server + "1";
      case "BR1":
      case "EUN1":
      case "EUW1":
      case "JP1":
      case "KR":
      case "LA1":
      case "LA2":
      case "NA1":
      case "OC1":
      case "PH2":
      case "RU":
      case "SG2":
      case "TH2":
      case "TR1":
      case "TW2":
      case "VN2":
        return server;
      case "LA":
        return "LA1";
    }

    return "";
  },

  getLatestVersion: async function (): Promise<string> {
    const response = await axios.get(
      "https://ddragon.leagueoflegends.com/api/versions.json"
    );
    const versions = response.data;
    return versions[0];
  },

  getLeagueIcon: function (iconId: string, version: string): string {
    const icon = `https://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${iconId}.png`;

    return icon;
  },

  getLeagueSummoner: async function (
    gameName: string,
    server: string
  ): Promise<SummonerV4> {
    const response = await axios.get(
      `https://${server}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${gameName}`,
      {
        headers: {
          "X-Riot-Token": config.RIOT_API_KEY,
        },
      }
    );

    return response.data;
  },

  listMatch: async function (
    puuid: string,
    region: string,
    count: number
  ): Promise<string[]> {
    const response = await axios.get(
      `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${count}`,
      {
        headers: {
          "X-Riot-Token": config.RIOT_API_KEY,
        },
      }
    );

    return response.data;
  },

  getMatch: async function (matchId: string, region: string): Promise<Match> {
    const response = await axios.get(
      `https://${region}.api.riotgames.com/lol/match/v5/matches/${matchId}`,
      {
        headers: {
          "X-Riot-Token": config.RIOT_API_KEY,
        },
      }
    );

    return response.data;
  },

  createMatchHistory: async function (
    puuid: string,
    region: string,
    count = 4
  ): Promise<matchHistory[]> {
    const matchListId = await riotUtils.listMatch(puuid, region, count);
    const matchHistory = [];

    for (const matchId of matchListId) {
      const match = await riotUtils.getMatch(matchId, region);
      const { info } = match;

      const participants = info.participants;
      const participantId = participants.findIndex(
        (participant) => participant.puuid === puuid
      );

      const participant = participants[participantId];
      const {
        assists,
        deaths,
        kills,
        win,
        championName,
        visionWardsBoughtInGame,
      } = participant;

      const gameDuration = info.gameDuration;

      const gameTime = new Date(gameDuration * 1000)
        .toISOString()
        .substr(11, 8);

      const matchData = {
        assists,
        deaths,
        kills,
        win,
        championName,
        gameTime,
        visionWardsBoughtInGame,
      };

      matchHistory.push(matchData);
    }

    return matchHistory;
  },

  getRankedInfo: async function (
    summonerId: string,
    server: string,
    queueType: string
  ) {
    const response: RawResponse<Entries[]> = await axios.get(
      `https://${server}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`,
      {
        headers: {
          "X-Riot-Token": config.RIOT_API_KEY,
        },
      }
    );

    const soloInfo = response.data.find(
      (queue) => queue.queueType === queueType
    );

    return soloInfo;
  },
};

export default riotUtils;
