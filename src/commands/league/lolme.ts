import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import riotUtils from "../../utils/utilsLeague";
import { getUserData } from "../../service/supabase/user";
import { messages } from "../../utils/messages";
import {
  getAllChampions,
  getLatestVersion,
  getMasteries,
} from "../../service/riot";
import { getUserStyle } from "../../service/supabase/profile_style";

export const data = new SlashCommandBuilder()
  .setName("lolme")
  .setDescription("Obtenha informações do seu perfil do League of Legends");

export async function execute(interaction: CommandInteraction) {
  const data = await getUserData({ id_discord: interaction.user.id });
  const userStyle = await getUserStyle(interaction.user.id);
  const latestVersion = await getLatestVersion();
  const allChampions = await getAllChampions(latestVersion);
  const sentMessage = await interaction.reply("Carregando...");

  let championName = "Garen";
  let skin = 0;
  let color = "#000000";
  const user = data;

  if (!user) {
    interaction.reply(messages.userNull);

    return;
  }

  const { puuid, server } = user;

  if (userStyle && userStyle.champion && userStyle.skin) {
    championName = userStyle.champion;
    skin = userStyle.skin;
  } else {
    const masteries = await getMasteries(puuid, server, 1);
    const championId = masteries[0].championId;

    for (const champion in allChampions) {
      if (allChampions[champion].key === championId.toString()) {
        championName = allChampions[champion].id;
        break;
      }
    }
  }

  try {
    const embed = await riotUtils.createEmbdedProfile(
      user,
      championName,
      skin,
      server,
      color,
      latestVersion
    );

    sentMessage.edit({ embeds: [embed], content: "" });
  } catch (error: any) {
    console.log(error);
    sentMessage.edit(messages.errorFetch);
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
