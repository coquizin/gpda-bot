import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import riotUtils from "./utilsLeague";
import userData from "./userData";
import { EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("lolme")
  .setDescription("Get user's League of Legends information");

export async function execute(interaction: CommandInteraction) {
  const userRiotData = userData.getUserData();
  const user = userRiotData[interaction.user.id];

  if (!user) {
    interaction.reply(
      "Please set your Riot Name and Region using /league first."
    );

    return;
  }

  const latestVersion = await riotUtils.getLatestVersion();
  const { puuid, server, tagLine } = user;

  try {
    const summonerData = await riotUtils.getLeagueSummoner(puuid, server);

    const summonerName = summonerData.name;
    const summonerLevel = summonerData.summonerLevel.toString();
    const profileIconId = summonerData.profileIconId.toString();
    const leagueId = summonerData.id.toString();
    const icon = riotUtils.getLeagueIcon(profileIconId, latestVersion);

    const leagueInfo = await riotUtils.getRankedInfo(
      leagueId,
      server,
      "RANKED_SOLO_5x5"
    );

    const tier = leagueInfo ? leagueInfo.tier : "Unranked";
    const rank = leagueInfo ? leagueInfo.rank : "";
    const wins = leagueInfo ? leagueInfo.wins : 0;
    const losses = leagueInfo ? leagueInfo.losses : 0;
    const lp = leagueInfo ? leagueInfo.leaguePoints.toString() : 0;

    const embed = new EmbedBuilder()
      .setDescription("League of Legends Information")
      .setColor("#0099ff")
      .setAuthor({
        name: summonerName,
        iconURL: icon,
      })
      .setThumbnail(icon)
      .addFields(
        {
          name: "Summoner Name",
          value: `${summonerName} #${tagLine}`,
        },
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
          name: "Wins",
          value: `${wins}`,
          inline: true,
        },
        {
          name: "Losses",
          value: `${losses}`,
          inline: true,
        },
        {
          name: "Win Rate",
          value: `${((wins / (wins + losses)) * 100).toFixed(2)}%`,
          inline: true,
        },
        {
          name: "Queue Type",
          value: "Ranked Solo/Duo",
          inline: true,
        }
      )
      .setTimestamp()
      .setFooter({
        text: "GPDA BOT",
        iconURL: "https://i.imgur.com/AfFp7pu.png",
      });

    interaction.reply({ embeds: [embed] });
  } catch (error: any) {
    console.error("Error fetching user data:", error);
    interaction.reply("Error fetching user data. Please try again later.");
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
