import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import axios from "axios";
import { config } from "@config/config";
import riotUtils from "@utils/utilsLeague";
import { getUserData, updateUserData } from "@service/supabase/user";
import { messages } from "@utils/messages";
import { SummonerData } from "./types/type";

export const data = new SlashCommandBuilder()
  .setName("leagueup")
  .setDescription("Atualize sua conta de League of Legends")
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
  const user = await getUserData({ id_discord: interaction.user.id });

  if (!user) {
    interaction.reply(messages.userNull);

    return;
  }

  const gameName = interaction.options.get("name")?.value || "";
  const tagLine = interaction.options.get("tag")?.value || "";
  let server = interaction.options.get("server")?.value || "br1";

  tagLine?.toString().toUpperCase().replace("#", "");
  gameName.toString().replaceAll(" ", "%20");

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

    const userUpdate = {
      gameName: summonerData.gameName,
      tagLine: summonerData.tagLine,
      region,
      server,
      puuid: summonerData.puuid,
      id_discord: interaction.user.id,
      id: user.id,
    };

    await updateUserData(userUpdate);

    interaction.reply(messages.userUpdated);
  } catch (error) {
    console.log(error);
    interaction.reply(messages.errorUpdate);
  }
}
