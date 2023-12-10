const { default: axios } = require("axios");
import { EmbedBuilder } from "discord.js";
import { config } from "../config/config";
import {
  Entries,
  Match,
  MatchHistory,
  RawResponse,
  SummonerV4,
} from "../commands/league/types/type";
import { UserData } from "src/entities/User";
import { getLatestVersion } from "src/service/riot";

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

  getLeagueIcon: function (iconId: string, version: string): string {
    const icon = `https://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${iconId}.png`;

    return icon;
  },

  getChampionSquareImage: function (championName: string, version: string) {
    const championImage = `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${championName}.png`;

    return championImage;
  },

  getChampionImage: function (championName: string, skin: number = 0) {
    const championImage = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championName}_${skin}.jpg`;

    return championImage;
  },

  getItemImage: function (itemId: number, version: string) {
    const itemImage = `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${itemId}.png`;

    return itemImage;
  },

  getGameMode: function (gameMode: string) {
    switch (gameMode) {
      case "CLASSIC":
        return "Ranked Solo/Duo";
      case "ARAM":
        return "ARAM";
      case "URF":
        return "URF";
      case "TFT":
        return "TFT";
      case "CHERRY":
        return "Arena";
    }

    return "";
  },

  createEmbedMatchHistory: async function (
    matchHistory: MatchHistory[],
    user: UserData,
    currentPage: number
  ) {
    const latestVersion = await getLatestVersion();

    const championSquareImage = riotUtils.getChampionSquareImage(
      matchHistory[0].participant.championName,
      latestVersion
    );

    const gameTime = new Date(matchHistory[0].info.gameDuration * 1000)
      .toISOString()
      .substr(11, 8);

    const championImage = riotUtils.getChampionImage(
      matchHistory[0].participant.championName
    );

    const { item0, item1, item2, item3, item4, item5, item6 } =
      matchHistory[0].participant;

    const item0Image = riotUtils.getItemImage(item0, latestVersion);
    const item1Image = riotUtils.getItemImage(item1, latestVersion);
    const item2Image = riotUtils.getItemImage(item2, latestVersion);
    const item3Image = riotUtils.getItemImage(item3, latestVersion);
    const item4Image = riotUtils.getItemImage(item4, latestVersion);
    const item5Image = riotUtils.getItemImage(item5, latestVersion);
    const item6Image = riotUtils.getItemImage(item6, latestVersion);

    let embedColor = "#0099ff";

    if (matchHistory[0].participant.win) {
      embedColor = "#00ff00";
    } else {
      embedColor = "#ff0000";
    }

    const embed = new EmbedBuilder()
      // .setDescription("League of Legends History")
      .setColor(embedColor as any)
      .setTimestamp()
      .setAuthor({
        name: `${user.gameName} - ${riotUtils.getGameMode(
          matchHistory[0].info.gameMode
        )}`,
      })
      .setImage(championImage)
      .setFooter({
        text: `Page ${currentPage + 1}/20`,
      })
      .setThumbnail(championSquareImage);

    matchHistory.forEach((match) => {
      embed.addFields({
        name: `${match.participant.championName} - ${
          match.participant.win ? "Victory" : "Defeat"
        }`,
        value: `\nKDA: ${match.participant.kills}/${match.participant.deaths}/${match.participant.assists}\n CS: ${match.participant.totalMinionsKilled} - Gold: ${match.participant.goldEarned} \n Tempo: ${gameTime} `,
      });
      embed.addFields({
        name: "Items",
        value: `[Item 1](${item0Image}) [Item 2](${item1Image}) [Item 3](${item2Image}) [Item 4](${item3Image}) [Item 5](${item4Image}) [Item 6](${item5Image}) [Item 7](${item6Image})`,
      });
    });

    return embed;
  },
};

export default riotUtils;
