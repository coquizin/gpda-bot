import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import axios from "axios";
import { config } from "../../config/config";
import riotUtils from "./utilsLeague";
import userData from "./userData";

interface SummonerData {
  gameName: string;
  tagLine: string;
  puuid: string;
}

export const data = new SlashCommandBuilder()
  .setName("league")
  .setDescription("Set user's Riot Name and Region")
  .addStringOption((option) =>
    option.setName("name").setDescription("Riot Nickname").setRequired(true)
  )
  .addStringOption((option) =>
    option.setName("tag").setDescription("Riot Tag").setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("server")
      .setDescription("server (e.g., br1)")
      .setRequired(false)
  );

export async function execute(interaction: CommandInteraction) {
  const gameName = interaction.options.get("name")?.value || "";
  const tagLine = interaction.options.get("tag")?.value || "";
  let server = interaction.options.get("server")?.value || "br1";

  const region = riotUtils.getRegion(server as string);
  server = riotUtils.getSaneServer(server as string);

  try {
    const response = await axios.get<SummonerData>(
      `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`,
      {
        headers: {
          "X-Riot-Token": config.RIOT_API_KEY,
        },
      }
    );

    const summonerData = response.data;

    userData.setUserData(interaction.user.id, {
      gameName: summonerData.gameName,
      tagLine: summonerData.tagLine,
      region,
      server,
      puuid: summonerData.puuid,
    });

    interaction.reply(`Summoner's Account set with success!`);
  } catch (error) {
    console.error("Error fetching user data:", error);
    interaction.reply("Error fetching user data. Please try again later.");
  }
}
