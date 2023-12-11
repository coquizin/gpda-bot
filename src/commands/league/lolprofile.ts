import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import riotUtils from "@utils/utilsLeague";
import { getUserData } from "@service/supabase/user";
import { messages } from "@utils/messages";
import { getAllChampions, getLatestVersion, getMasteries } from "@service/riot";
import axios from "axios";
import { SummonerData } from "./types/type";
import { config } from "@config/config";
import { getUserStyle } from "@service/supabase/profile_style";

export const data = new SlashCommandBuilder()
  .setName("lolprofile")
  .setDescription("Obtenha informações de um perfil do League of Legends")
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
  const gameName = interaction.options.get("name")?.value || "";
  const tagLine = interaction.options.get("tag")?.value || "";
  let server = interaction.options.get("server")?.value || "br1";
  const sentMessage = await interaction.reply("Carregando...");

  tagLine.toString().toUpperCase().replace("#", "");
  gameName.toString().replaceAll(" ", "%20");

  server = riotUtils.getSaneServer(server as string);
  const region = riotUtils.getRegion(server as string);

  const latestVersion = await getLatestVersion();
  const allChampions = await getAllChampions(latestVersion);

  try {
    const response = await axios.get<SummonerData>(
      `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName
        .toString()
        .replaceAll(" ", "%20")}/${tagLine}`,
      {
        headers: {
          "X-Riot-Token": config.RIOT_API_KEY,
        },
      }
    );

    let championName = "";
    let skin = 0;
    const { puuid } = response.data;
    const userData = await getUserData({ puuid: puuid });

    if (userData) {
      const userStyle = await getUserStyle(userData.id_discord);

      if (userStyle && userStyle.champion && userStyle.skin) {
        championName = userStyle.champion;
        skin = userStyle.skin;
      }
    }

    if (!championName) {
      const masteries = await getMasteries(puuid, server, 1);
      const championId = masteries[0].championId;

      for (const champion in allChampions) {
        if (allChampions[champion].key === championId.toString()) {
          championName = allChampions[champion].id;
          break;
        }
      }
    }

    const user = {
      gameName: response.data.gameName,
      tagLine: response.data.tagLine,
      region: region,
      server: server,
      puuid: puuid,
      id: "",
      id_discord: "",
    };

    const embed = await riotUtils.createEmbdedProfile(
      user,
      championName,
      skin,
      server,
      "#000000",
      latestVersion
    );

    sentMessage.edit({ embeds: [embed], content: "" });
  } catch (error: any) {
    console.log(error);
    sentMessage.edit(messages.errorFind);
  }
}
