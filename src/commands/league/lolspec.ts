import {
  SlashCommandBuilder,
  CommandInteraction,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ComponentType,
} from "discord.js";
import riotUtils from "@utils/utilsLeague";
import { getUserData } from "@service/supabase/user";
import { messages } from "@utils/messages";
import {
  getActiveGame,
  getLeagueSummoner,
  getRankedInfo,
  getSummerbyNameTag,
} from "@service/riot";
import { UserData } from "@entities/User";

export const data = new SlashCommandBuilder()
  .setName("lolspec")
  .setDescription("Ver se o seu time está online")
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
  const sentMessage = await interaction.reply("Carregando...");

  const gameName = interaction.options.get("name")?.value as string;
  const tagLine = interaction.options.get("tag")?.value;
  let server = interaction.options.get("server")?.value
    ? (interaction.options.get("server")?.value as string)
    : "br1";

  if (gameName || tagLine) {
    if (!gameName) {
      sentMessage.edit(messages.missingArgs);
      return;
    }

    if (!tagLine) {
      sentMessage.edit(messages.missingArgs);
      return;
    }

    tagLine.toString().toUpperCase().replace("#", "");
    gameName.toString().replaceAll(" ", "%20");

    server = riotUtils.getSaneServer(server);
    const region = riotUtils.getRegion(server);

    const response = await getSummerbyNameTag(
      gameName,
      tagLine as string,
      region
    );

    if (!response) {
      sentMessage.edit(messages.errorFetch);
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
    user = await getUserData({ id_discord: interaction.user.id });
  }

  if (!user) {
    sentMessage.edit(messages.userNull);
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
  let currentPage = 0;
  const maxPage = 2;

  try {
    const summonerData = await getLeagueSummoner(
      userData.puuid,
      userData.server
    );

    const activeMatch = await getActiveGame(summonerData.id, userData.server);

    const usersData: any = [];

    for (const player of activeMatch.participants) {
      const leagueInfo = await getRankedInfo(
        player.summonerId,
        server,
        "RANKED_SOLO_5x5"
      );

      const tier = leagueInfo ? leagueInfo.tier : "Unranked";
      const rank = leagueInfo ? leagueInfo.rank : "";
      const wins = leagueInfo ? leagueInfo.wins : 0;
      const losses = leagueInfo ? leagueInfo.losses : 0;
      const winrate =
        wins + losses !== 0
          ? ((wins / (wins + losses)) * 100).toFixed(2)
          : "N/A";
      const lp = leagueInfo ? leagueInfo.leaguePoints.toString() : 0;

      const user = {
        summonerName: player.summonerName,
        teamId: player.teamId,
        championId: player.championId,
        tier,
        rank,
        lp,
        winrate,
        wins,
        losses,
      };

      usersData.push(user);
    }

    const embed = await riotUtils.createEmbedMatch(
      activeMatch,
      usersData,
      currentPage
    );

    sentMessage.edit({
      embeds: [embed],
      components: [row],
      content: "",
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
      const newEmbed = await riotUtils.createEmbedMatch(
        activeMatch,
        usersData,
        currentPage
      );

      sentMessage.edit({ embeds: [newEmbed] }).catch(console.error);
    }
  } catch (error) {
    console.log(error);
    sentMessage.edit(messages.userNotInGame);
  }
}
