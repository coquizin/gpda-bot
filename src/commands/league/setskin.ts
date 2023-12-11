import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { getUserData } from "../../service/supabase/user";
import { messages } from "../../utils/messages";
import { updateSkin } from "../../service/supabase/profile_style";

export const data = new SlashCommandBuilder()
  .setName("setskin")
  .setDescription(
    "Escolha uma skin para o seu perfil do League of Legends /lolme."
  )
  .addStringOption((option) =>
    option
      .setName("champion")
      .setDescription("Nome do campeão")
      .setRequired(true)
  )
  .addIntegerOption((option) =>
    option.setName("id").setDescription("Número da skin").setRequired(true)
  );

export async function execute(interaction: CommandInteraction) {
  const data = await getUserData({ id_discord: interaction.user.id });
  const champion = interaction.options.get("champion")?.value || "";
  const skin = interaction.options.get("id")?.value?.toString() || "";
  let championName =
    champion.toString().charAt(0).toUpperCase() +
    champion.toString().slice(1).toLowerCase();

  //transformar em maiscula depois dos espaços
  championName = championName
    .toString()
    .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());

  championName = championName.toString().replaceAll(" ", "");
  const skinNumber = parseInt(skin.toString());

  const user = data;

  if (!user) {
    interaction.reply(messages.userNull);

    return;
  }

  try {
    await updateSkin(interaction.user.id, championName, skinNumber);

    interaction.reply(messages.skinUpdated);
  } catch (error: any) {
    console.log(error);
    interaction.reply(messages.skinUpError);
  }
}
