import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import axios from "axios";
import { config } from "../../config/config";
import riotUtils from "../../utils/utilsLeague";
import { createUserData, getUserData } from "src/service/supabase/User";
import { messages } from "src/utils/messages";

interface SummonerData {
  gameName: string;
  tagLine: string;
  puuid: string;
}

export const data = new SlashCommandBuilder()
  .setName("league")
  .setDescription("Cadastre sua conta do League of Legends")
  .addStringOption((option) =>
    option.setName("name").setDescription("Riot Nickname").setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("tag")
      .setDescription("Riot Tag, não inclua #")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("server")
      .setDescription("server (e.g., br1)")
      .setRequired(false)
  );

export async function execute(interaction: CommandInteraction) {
  const user = await getUserData(interaction.user.id);

  if (user) {
    interaction.reply(messages.userExists);

    return;
  }

  const gameName = interaction.options.get("name")?.value || "";
  const tagLine = interaction.options.get("tag")?.value || "";
  let server = interaction.options.get("server")?.value || "br1";

  tagLine.toString().replace("#", "");

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

    const user = {
      gameName: summonerData.gameName,
      tagLine: summonerData.tagLine,
      region,
      server,
      puuid: summonerData.puuid,
      id_discord: interaction.user.id,
    };

    await createUserData(user);

    interaction.reply(messages.useSetted);
  } catch (error) {
    console.log(error);
    interaction.reply(messages.errorCreate);
  }
}
