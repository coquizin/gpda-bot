const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dog")
    .setDescription("Replies with dog image!"),
  async execute(interaction) {
    const { request } = require("undici");

    const dogResult = await request("https://random.dog/woof.json");
    const { body } = dogResult;
    const data = await body.json();
    const file = data.url;

    interaction.reply({ files: [file] });
  },
};
