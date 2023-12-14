import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { messages } from "@utils/messages";
import { askGPT } from "@/service/gpt";

export const data = new SlashCommandBuilder()
  .setName("pergunta")
  .setDescription("Faça sua pergunta ao GPT-3")
  .addStringOption((option) =>
    option
      .setName("pergunta")
      .setDescription("Pergunta que será feita ao GPT-3")
      .setRequired(true)
  );

export async function execute(interaction: CommandInteraction) {
  const prompt = interaction.options.get("pergunta")?.value?.toString() || "";

  if (!prompt) {
    interaction.reply(messages.noPrompt);

    return;
  }

  const sentMessage = await interaction.reply("Perguntando ao GPT-3...");

  try {
    const answer = await askGPT(prompt);

    sentMessage.edit(answer);
  } catch (error) {
    console.log(error);
    sentMessage.edit(messages.noAnswer);
  }
}
