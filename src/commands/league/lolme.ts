import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import riotUtils from "../../utils/utilsLeague";
import { EmbedBuilder } from "discord.js";
import { getUserData } from "src/service/supabase/User";
import { messages } from "src/utils/messages";
import {
  getLatestVersion,
  getLeagueSummoner,
  getRankedInfo,
} from "src/service/riot";

export const data = new SlashCommandBuilder()
  .setName("lolme")
  .setDescription("Obtenha informações do seu perfil do League of Legends");

export async function execute(interaction: CommandInteraction) {
  const data = await getUserData(interaction.user.id);

  const user = data;

  if (!user) {
    interaction.reply(messages.userNull);

    return;
  }

  const latestVersion = await getLatestVersion();
  const { puuid, server, tagLine } = user;

  try {
    const summonerData = await getLeagueSummoner(puuid, server);

    const summonerName = summonerData.name;
    const summonerLevel = summonerData.summonerLevel.toString();
    const profileIconId = summonerData.profileIconId.toString();
    const leagueId = summonerData.id.toString();
    const icon = riotUtils.getLeagueIcon(profileIconId, latestVersion);
    const championImage = riotUtils.getChampionImage("Vayne", 13);
    const leagueInfo = await getRankedInfo(leagueId, server, "RANKED_SOLO_5x5");

    const tier = leagueInfo ? leagueInfo.tier : "Unranked";
    const rank = leagueInfo ? leagueInfo.rank : "";
    const wins = leagueInfo ? leagueInfo.wins : 0;
    const losses = leagueInfo ? leagueInfo.losses : 0;
    const winrate =
      wins + losses !== 0 ? ((wins / (wins + losses)) * 100).toFixed(2) : "N/A";
    const lp = leagueInfo ? leagueInfo.leaguePoints.toString() : 0;

    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setAuthor({
        name: `${summonerName} #${tagLine}`,
        iconURL: icon,
      })
      .setThumbnail(icon)
      .addFields(
        // {
        //   name: "Nick de Invocador",
        //   value: `${summonerName} #${tagLine}`,
        // },
        { name: "Level", value: summonerLevel, inline: true },
        {
          name: "Server",
          value: server.toUpperCase(),
          inline: true,
        },
        {
          name: "Rank",
          value: `${tier} ${rank} ${lp} LP`,
          inline: true,
        },
        {
          name: "Vitórias",
          value: `${wins}`,
          inline: true,
        },
        {
          name: "Derrrotas",
          value: `${losses}`,
          inline: true,
        },
        {
          name: "Win Rate",
          value: `${winrate}%`,
          inline: true,
        },
        {
          name: "Queue Type",
          value: "Ranked Solo/Duo",
          inline: true,
        }
      )
      .setImage(championImage)
      .setTimestamp()
      .setFooter({
        text: "GPDA BOT",
        iconURL: "https://i.imgur.com/AfFp7pu.png",
      });

    interaction.reply({ embeds: [embed] });
  } catch (error: any) {
    console.log(error);
    interaction.reply(messages.errorFetch);
  }
}

// const coquizinData = {
//   gameName: "Coquizin",
//   tagLine: "777",
//   server: "BR1",
//   region: "americas",
//   puuid:
//     "03CHJhPEOuygSrc4g2W-4Dctojo-t7s2eWLkAqb7LK8OjjMdicc4zEuPvOu7RXcxKf9XrrYxnVKSQw",
// };
