import { SlashCommandBuilder, CommandInteraction } from "discord.js";

import axios from "axios";

export const data = new SlashCommandBuilder()
  .setName("dog")
  .setDescription("Replies with a dog image!");

export async function execute(interaction: CommandInteraction) {
  try {
    const response = await axios.get("https://random.dog/woof.json");
    const file: string = response.data.url;

    interaction.reply({ files: [file] });
  } catch (error) {
    console.error("Error fetching dog image:", error);
    interaction.reply("There was an error fetching the dog image.");
  }
}
