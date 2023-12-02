const { request } = require("undici");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("urban")
    .setDescription("Replies with definition from Urban Dictionary")
    .addStringOption((option) =>
      option
        .setName("term")
        .setDescription("The term to search for")
        .setRequired(true)
    ),
  async execute(interaction) {
    const term = interaction.options.getString("term");
    const query = new URLSearchParams({ term });
    const dictResult = await request(
      `https://api.urbandictionary.com/v0/define?${query}`
    );

    const { list } = await dictResult.body.json();

    if (!list.length) {
      return interaction.reply(`No results found for **${term}**.`);
    }

    // const trim = (str, max) =>
    //   str.length > max ? `${str.slice(0, max - 3)}...` : str;
    // const [answer] = list;

    // const embed = new MessageEmbed()
    //   .setColor("#efff00")
    //   .setTitle(answer.word)
    //   .setURL(answer.permalink)
    //   .addFields(
    //     { name: "Definition", value: trim(answer.definition, 1024) },
    //     { name: "Example", value: trim(answer.example, 1024) },
    //     {
    //       name: "Rating",
    //       value: `${answer.thumbs_up} thumbs up. ${answer.thumbs_down} thumbs down.`,
    //     }
    //   );

    interaction.reply(`**${term}**: ${list[0].definition}`);
  },
};
