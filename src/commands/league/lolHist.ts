import {
  SlashCommandBuilder,
  CommandInteraction,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ComponentType,
} from "discord.js";
import riotUtils from "./utilsLeague";
import userData from "./userData";

export const data = new SlashCommandBuilder()
  .setName("lolhist")
  .setDescription("Get user's League of Legends History");

export async function execute(interaction: CommandInteraction) {
  const userRiotData = userData.getUserData();

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

  const user = userRiotData[interaction.user.id];

  if (!user) {
    interaction.reply(
      "Please set your Riot Name and Region using /league first."
    );
    return;
  }

  // const user = {
  //   gameName: "coquizin",
  //   tagLine: "777",
  //   server: "BR1",
  //   region: "americas",
  //   puuid:
  //     "03CHJhPEOuygSrc4g2W-4Dctojo-t7s2eWLkAqb7LK8OjjMdicc4zEuPvOu7RXcxKf9XrrYxnVKSQw",
  // };

  try {
    const matchHistory = await riotUtils.createMatchHistory(
      user.puuid,
      user.region
    );

    const embed = await riotUtils.createEmbedMatchHistory(
      matchHistory,
      user,
      0
    );

    let currentPage = 0;
    const maxPage = 20;
    const resultsPerPage = 1;

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
        if ((currentPage + 1) * resultsPerPage < maxPage) {
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
      const matchHistory = await riotUtils.createMatchHistory(
        user.puuid,
        user.region,
        currentPage
      );

      const newEmbed = await riotUtils.createEmbedMatchHistory(
        matchHistory,
        user,
        currentPage
      );

      sentMessage.edit({ embeds: [newEmbed] }).catch(console.error);
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    interaction.reply("Error fetching user data. Please try again later.");
  }
}
