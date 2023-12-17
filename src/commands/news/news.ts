import {
  SlashCommandBuilder,
  CommandInteraction,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ComponentType,
} from "discord.js";
import { messages } from "@utils/messages";
import { getEveryNews } from "@service/news";
import { newsEmbed } from "@utils/news";

export const data = new SlashCommandBuilder()
  .setName("news")
  .setDescription("Retorne notícias sobre um tema")
  .addStringOption((option) =>
    option.setName("tema").setDescription("Escolha um tema").setRequired(true)
  );

export async function execute(interaction: CommandInteraction) {
  const tema = interaction.options.get("tema")?.value?.toString() || "";

  if (!tema) {
    interaction.reply(messages.noPrompt);

    return;
  }

  const prevPage = new ButtonBuilder()
    .setCustomId("prevPage")
    .setLabel("\u200B")
    .setEmoji({ name: "⬅️" })
    .setStyle(ButtonStyle.Secondary);

  const nextPage = new ButtonBuilder()
    .setCustomId("nextPage")
    .setLabel("\u200B")
    .setEmoji({ name: "➡️" })
    .setStyle(ButtonStyle.Secondary);

  const row = new ActionRowBuilder<ButtonBuilder>({
    components: [prevPage, nextPage],
  });

  const sentMessage = await interaction.reply("Procurando notícias...");

  try {
    const news = await getEveryNews(tema);
    const maxPage = news.totalResults;
    let currentPage = 0;

    const embed = newsEmbed(news.articles[currentPage]);

    sentMessage.edit({ embeds: [embed], content: "", components: [row] });

    const collector = sentMessage.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 1_000_000,
    });

    collector.on("collect", async (i) => {
      if (i.customId === "prevPage") {
        if (currentPage > 0) {
          currentPage--;
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
      const newEmbed = newsEmbed(news.articles[currentPage]);

      sentMessage.edit({ embeds: [newEmbed] }).catch(console.error);
    }
  } catch (error) {
    console.log(error);
    sentMessage.edit(messages.noAnswer);
  }
}
