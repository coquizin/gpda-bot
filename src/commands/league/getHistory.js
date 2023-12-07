// const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
// const config = require("../../config/config.json");
// const { createMatchHistory } = require("./utilsLeague");
// const { getUserData } = require("./userData");

// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName("gethistory")
//     .setDescription("Get user's League of Legends History"),
//   async execute(interaction) {
//     const userRiotData = getUserData();
//     const userData = userRiotData[interaction.user.id];

//     if (!userData) {
//       // return interaction.reply(
//       //   "Please set your Riot Name and Region using /setUser first."
//       // );
//     }

//     // const { gameName, server, puuid } = userData;

//     const coquizinData = {
//       gameName: "Coquizin",
//       tagLine: "777",
//       server: "BR1",
//       region: "americas",
//       puuid:
//         "03CHJhPEOuygSrc4g2W-4Dctojo-t7s2eWLkAqb7LK8OjjMdicc4zEuPvOu7RXcxKf9XrrYxnVKSQw",
//     };

//     try {
//       const matchHistory = await createMatchHistory(
//         coquizinData.puuid,
//         coquizinData.region,
//         config,
//         7
//       );

//       const embed = new EmbedBuilder()
//         .setDescription("League of Legends Information")
//         .setColor("#0099ff")
//         .setTimestamp()
//         .setFooter({
//           text: "GPDA BOT",
//           iconURL: "https://i.imgur.com/AfFp7pu.png",
//         });

//       // Adicionar os dados do array ao embed
//       matchHistory.forEach((match, index) => {
//         embed.addField(
//           `Match ${index + 1}`,
//           `
//         **Champion:** ${match.championName}
//         **Kills:** ${match.kills}
//         **Deaths:** ${match.deaths}
//         **Assists:** ${match.assists}
//         **Win:** ${match.win ? "Yes" : "No"}
//         **Game Time:** ${match.gameTime}
//         **Vision Wards Bought:** ${match.visionWardsBoughtInGame}
//       `
//         );
//       });
//       interaction.reply({ embeds: [embed] });
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//       interaction.reply("Error fetching user data. Please try again later.");
//     }
//   },
// };
