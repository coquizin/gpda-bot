import {
  SlashCommandBuilder,
  CommandInteraction,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ComponentType,
} from "discord.js";
import riotUtils from "@utils/utilsLeague";
import { messages } from "@utils/messages";
import { getChampionData, getLatestVersion } from "@service/riot";

export const data = new SlashCommandBuilder()
  .setName("skin")
  .setDescription("Escolha um campeão para obter todas as skins disponíveis.")
  .addStringOption((option) =>
    option
      .setName("champion")
      .setDescription("Nome do campeão")
      .setRequired(true)
  );

export async function execute(interaction: CommandInteraction) {
  const champion = interaction.options.get("champion")?.value || "";
  let championName =
    champion.toString().charAt(0).toUpperCase() +
    champion.toString().slice(1).toLowerCase();

  //transformar em maiscula depois dos espaços
  championName = championName
    .toString()
    .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());

  championName = championName.toString().replaceAll(" ", "");

  const prevPage = new ButtonBuilder()
    .setCustomId("prevPage")
    .setLabel("\u200B")
    .setEmoji({ name: "⬅️" })
    .setStyle(ButtonStyle.Secondary);

  const nextPage = new ButtonBuilder()
    .setCustomId("nextPage")
    .setLabel("\u200B\u200B")
    .setEmoji({ name: "➡️" })
    .setStyle(ButtonStyle.Secondary);

  const row = new ActionRowBuilder<ButtonBuilder>({
    components: [prevPage, nextPage],
  });

  try {
    const latestVersion = await getLatestVersion();
    const championData = await getChampionData(latestVersion, championName);
    const maxPage = championData.skins.length;
    let currentPage = 0;

    const embed = await riotUtils.createEmbedChampion(
      championData,
      championName,
      currentPage,
      maxPage,
      latestVersion
    );

    const sentMessage = await interaction.reply({
      embeds: [embed],
      components: [row],
      fetchReply: true,
    });

    const collector = sentMessage.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 3_000_000,
    });

    collector.on("collect", async (i) => {
      if (i.customId === "prevPage") {
        if (currentPage > 0) {
          currentPage--;
          await updateEmbed();
        } else {
          currentPage = maxPage - 1;
          await updateEmbed();
        }
      }

      if (i.customId === "nextPage") {
        if (currentPage + 1 < maxPage) {
          currentPage++;
          await updateEmbed();
        } else {
          currentPage = 0;
          await updateEmbed();
        }
      }

      await i.deferUpdate();
    });

    collector.on("end", async () => {
      console.log("ending");
      await sentMessage.edit({
        components: [],
      });
    });

    async function updateEmbed() {
      const newEmbed = await riotUtils.createEmbedChampion(
        championData,
        championName,
        currentPage,
        maxPage,
        latestVersion
      );

      sentMessage.edit({ embeds: [newEmbed] }).catch(console.error);
    }
  } catch (error: any) {
    console.log(error);
    interaction.reply(messages.skinFetchError);
  }
}
