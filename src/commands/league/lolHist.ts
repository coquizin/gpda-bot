import {
  SlashCommandBuilder,
  CommandInteraction,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ComponentType,
} from "discord.js";
import riotUtils from "../../utils/utilsLeague";
import { getUserData } from "src/service/supabase/User";
import { messages } from "src/utils/messages";
import {
  createMatchHistory,
  getSummerbyNameTag,
  listMatch,
} from "src/service/riot";
import { UserData } from "src/entities/User";

export const data = new SlashCommandBuilder()
  .setName("lolhist")
  .setDescription("Histórico do jogador")
  .addStringOption((option) =>
    option.setName("name").setDescription("Nome do jogador").setRequired(false)
  )
  .addStringOption((option) =>
    option
      .setName("tag")
      .setDescription("Riot Tag, não inclua #")
      .setRequired(false)
  )
  .addStringOption((option) =>
    option
      .setName("server")
      .setDescription("server (e.g., br1)")
      .setRequired(false)
  );

export async function execute(interaction: CommandInteraction) {
  let user: UserData | null = null;
  const gameName = interaction.options.get("name")?.value as string;
  const tagLine = interaction.options.get("tag")?.value as string;
  let server = interaction.options.get("server")?.value
    ? (interaction.options.get("server")?.value as string)
    : "br1";

  if (gameName || tagLine) {
    if (!gameName) {
      interaction.reply(messages.missingArgs);
      return;
    }

    if (!tagLine) {
      interaction.reply(messages.missingArgs);
      return;
    }

    tagLine.toString().replace("#", "");

    const region = riotUtils.getRegion(server);

    const response = await getSummerbyNameTag(gameName, tagLine, region);

    if (!response) {
      interaction.reply(messages.errorFetch);
      return;
    }

    user = {
      id: "",
      gameName: response.data.gameName,
      tagLine: response.data.tagLine,
      region,
      server,
      puuid: response.data.puuid,
      id_discord: interaction.user.id,
    };
  } else {
    user = await getUserData(interaction.user.id);
  }

  if (!user) {
    interaction.reply(messages.userNull);
    return;
  }

  const userData = user;

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

  // const user = {
  //   gameName: "coquizin",
  //   tagLine: "777",
  //   server: "BR1",
  //   region: "americas",
  //   puuid:
  //     "03CHJhPEOuygSrc4g2W-4Dctojo-t7s2eWLkAqb7LK8OjjMdicc4zEuPvOu7RXcxKf9XrrYxnVKSQw",
  // };

  try {
    const matchListId = await listMatch(userData.puuid, userData.region, 0, 20);
    const maxPage = matchListId.length;
    const matchHistory = await createMatchHistory(
      userData.puuid,
      userData.region,
      matchListId[0]
    );

    const embed = await riotUtils.createEmbedMatchHistory(
      matchHistory,
      userData,
      0
    );

    let currentPage = 0;
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
      const matchHistory = await createMatchHistory(
        userData.puuid,
        userData.region,
        matchListId[currentPage]
      );

      const newEmbed = await riotUtils.createEmbedMatchHistory(
        matchHistory,
        userData,
        currentPage
      );

      sentMessage.edit({ embeds: [newEmbed] }).catch(console.error);
    }
  } catch (error) {
    console.log(error);
    interaction.reply(messages.errorFetch);
  }
}
